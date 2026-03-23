document.addEventListener('DOMContentLoaded', () => {
    const runBtn = document.getElementById('runBtn');
    const mapSourceSelect = document.getElementById('mapSourceSelect');
    const modelSelect = document.getElementById('modelSelect');
    const mapLoader = document.getElementById('mapLoader');
    
    const steps = [
        document.getElementById('step1'), document.getElementById('step2'),
        document.getElementById('step3'), document.getElementById('step4'),
        document.getElementById('step5'), document.getElementById('step6')
    ];
    
    const emptyEvalState = document.getElementById('emptyEvalState');
    const metricsContainer = document.getElementById('metricsContainer');
    const legendContainer = document.getElementById('legendContainer');
    const chartPlaceholder = document.getElementById('chartPlaceholder');
    const exportGroup = document.getElementById('exportGroup');
    const layerControls = document.getElementById('layerControls');
    
    // Map Setup
    const map = L.map('map').setView([21.1458, 79.0882], 5);
    const layers = {
        esri: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
        google: L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}'),
        osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    };
    layers.esri.addTo(map);

    mapSourceSelect.addEventListener('change', (e) => {
        map.eachLayer((layer) => { if (layer instanceof L.TileLayer) map.removeLayer(layer); });
        layers[e.target.value].addTo(map);
    });

    // Chart.js Setup for Phenology
    const ctx = document.getElementById('phenologyChart').getContext('2d');
    let phenologyChartIns = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            datasets: [{
                label: 'Mean NDVI',
                data: [],
                borderColor: '#00E5FF',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 1.0, ticks: { color: '#888', font: {family: 'monospace'} }, grid: { color: '#333' } },
                x: { ticks: { color: '#888', font: {family: 'monospace'} }, grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });

    let overlays = {
        classified: null,
        ndvi: null
    };
    let boundsPolygon = null;

    const delay = ms => new Promise(res => setTimeout(res, ms));

    runBtn.addEventListener('click', async () => {
        runBtn.disabled = true;
        mapLoader.classList.remove('hidden');
        
        if (overlays.classified) map.removeLayer(overlays.classified);
        if (overlays.ndvi) map.removeLayer(overlays.ndvi);
        if (boundsPolygon) map.removeLayer(boundsPolygon);
        
        layerControls.classList.add('hidden');
        exportGroup.classList.add('hidden');
        steps.forEach(s => { s.className = 'step pending'; });
        emptyEvalState.classList.remove('hidden');
        emptyEvalState.innerText = "Executing Base Modules...";
        metricsContainer.classList.add('hidden');
        legendContainer.classList.add('hidden');
        chartPlaceholder.style.display = 'flex';

        try {
            const bounds = map.getBounds();
            const payload = {
                west: bounds.getWest(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                north: bounds.getNorth(),
                model_type: modelSelect.value
            };

            // Module 1 
            steps[0].className = 'step active'; await delay(800); steps[0].className = 'step complete';
            // Module 2 & 3 
            steps[1].className = 'step active'; steps[2].className = 'step active'; await delay(1200);
            steps[1].className = 'step complete'; steps[2].className = 'step complete';

            // API Call (Module 4 Inference & Features)
            steps[3].className = 'step active';
            const response = await fetch('/api/run-pipeline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('API Pipeline Execution Failed');
            const data = await response.json();
            steps[3].className = 'step complete';

            // Store overlays natively
            overlays.classified = L.imageOverlay("data:image/png;base64," + data.map_image_base64, bounds, { opacity: 0.8 });
            overlays.ndvi = L.imageOverlay("data:image/png;base64," + data.ndvi_image_base64, bounds, { opacity: 0.75 });
            boundsPolygon = L.rectangle(bounds, { color: "#00E5FF", weight: 2, fill: false });
            
            // Render specific overlays
            overlays.classified.addTo(map);
            boundsPolygon.addTo(map);
            
            // Setup layer toggles
            layerControls.classList.remove('hidden');
            document.querySelectorAll('.layer-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('layerClassified').classList.add('active');

            // Render Phenology (Module 3 output)
            chartPlaceholder.style.display = 'none';
            phenologyChartIns.data.datasets[0].data = data.temporal_series;
            phenologyChartIns.update();

            // Render Module 5 Evaluation Render
            steps[4].className = 'step active'; await delay(500); steps[4].className = 'step complete';
            
            emptyEvalState.classList.add('hidden');
            metricsContainer.classList.remove('hidden');
            legendContainer.classList.remove('hidden');
            
            document.getElementById('valAcc').innerText = data.metrics.overall_accuracy + '%';
            document.getElementById('valF1').innerText = data.metrics.f1_score;
            document.getElementById('valPrec').innerText = data.metrics.precision;
            document.getElementById('valRec').innerText = data.metrics.recall;
            document.getElementById('valKap').innerText = data.metrics.kappa;
            
            const cm = data.confusion_matrix;
            document.getElementById('cmBody').innerHTML = `
                <tr><td class="correct">${cm[0][0]}</td><td>${cm[0][1]}</td><td>${cm[0][2]}</td></tr>
                <tr><td>${cm[1][0]}</td><td class="correct">${cm[1][1]}</td><td>${cm[1][2]}</td></tr>
                <tr><td>${cm[2][0]}</td><td>${cm[2][1]}</td><td class="correct">${cm[2][2]}</td></tr>
            `;

            // Module 6 Data Storage & UI actions
            steps[5].className = 'step active'; await delay(400); steps[5].className = 'step complete';
            exportGroup.classList.remove('hidden');

        } catch (error) {
            console.error(error);
            emptyEvalState.innerText = "Error encountered during pipeline execution.";
            emptyEvalState.style.color = "var(--error)";
        } finally {
            runBtn.disabled = false;
            mapLoader.classList.add('hidden');
        }
    });

    // Layer Toggle Logic
    document.getElementById('layerClassified').addEventListener('click', (e) => {
        document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        if (overlays.ndvi) map.removeLayer(overlays.ndvi);
        if (overlays.classified) overlays.classified.addTo(map);
    });

    document.getElementById('layerNDVI').addEventListener('click', (e) => {
        document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        if (overlays.classified) map.removeLayer(overlays.classified);
        if (overlays.ndvi) overlays.ndvi.addTo(map);
    });

    document.getElementById('layerRaw').addEventListener('click', (e) => {
        document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        if (overlays.classified) map.removeLayer(overlays.classified);
        if (overlays.ndvi) map.removeLayer(overlays.ndvi);
    });
    
    // Export actions
    document.getElementById('btnGeoTiff').addEventListener('click', () => { alert("Simulating generation of massive GeoTIFF spatial payload... Export successful."); });
    document.getElementById('btnPdf').addEventListener('click', () => { alert("Simulating compilation of Multi-Spectral Analysis Academic PDF Report... Download triggered."); });
});
