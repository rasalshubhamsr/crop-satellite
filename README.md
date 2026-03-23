<div align="center">
  <h1>🌍 Satellite Crop Classification Intelligence</h1>
  <p><strong>Enterprise-Grade Remote Sensing & Agronomic Context Engine</strong></p>
  
  [![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.103.1-009688.svg)](https://fastapi.tiangolo.com/)
  [![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900.svg)](https://leafletjs.com/)
  [![Status](https://img.shields.io/badge/Status-Active-success.svg)]()
</div>

<br />

## 📖 Overview
Agriculture is the backbone of the global economy. This project focuses on using remote sensing and machine learning to automatically identify crop types over large geographical areas. It enables accurate, large-scale crop monitoring, reduces manual surveys, and supports better agricultural planning and decision-making. 

Farmers, researchers, and government bodies often lack an automated, scalable, and cost-efficient system to classify and monitor different crop types. Without timely and accurate crop data, planning and resource distribution become inefficient. **This pipeline bridges that gap.**

## ✨ Core Features
*   **📡 Direct Satellite Ingestion**: Dynamic fetching of bounding box composites using high-resolution proxies for Sentinel-2/Landsat data.
*   **🧠 Multi-Model Deep Learning Pipeline**: Select between Random Forest (RF), Support Vector Machines (SVM), Convolutional Neural Networks (CNN), and Long Short-Term Memory (LSTM) classifications.
*   **🌱 Multi-Temporal Phenology**: Automated time-series analysis plotting Mean NDVI across a full 12-month growing season to identify crucial phenological shifting.
*   **🔬 Interactive Pixel Spectral Analysis**: Click anywhere on the map to trigger a cinematic zoom overlay that computationally calculates the specific Real-Time Spectral Signature (NDVI, R, G, B) of that exact coordinate.
*   **🗺️ Agronomic Context Fallback Engine**: A deterministic heuristic engine that evaluates geographical coordinates (Lat/Lng) against real-time global calendars to predict Current Season, Edaphic Topography (Soil Type), and secondary probabilistic crop bounds.

## 🏗️ Architecture Stack
*   **Frontend**: HTML5, Vanilla JavaScript, CSS3 (Glassmorphism UI)
*   **Mapping Intelligence**: Leaflet.js
*   **Charting**: Chart.js
*   **Backend Server**: FastAPI, Uvicorn
*   **Geospatial Processing**: NumPy, Pillow (PIL), Matplotlib (Server-side Colormapping)

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Python 3.9+ installed on your system.
```bash
python --version
```

### 2. Installation
Clone the repository and spin up a lightweight virtual environment:
```bash
# Clone the repo
git clone https://github.com/yourusername/crop-satellite.git
cd crop-satellite

# Create Virtual Environment
python -m venv venv

# Activate Virtual Environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn numpy pillow requests matplotlib
```

### 3. Execution
Boot the FastAPI application server:
```bash
python -m uvicorn src.api.main:app --port 8000 --reload
```
Navigate to **`http://localhost:8000`** in your web browser to enter the Multi-Spectral Dashboard.

## ⚙️ The 6-Module Academic Pipeline
This project is strictly structured around a rigorous 6-step analytical flow:
1.  **Data Collection Module**: Fetches AOI bounds via Earth Engine / Sentinel proxies.
2.  **Pre-Processing Module**: Cloud masking and fundamental geometric corrections.
3.  **Feature Extraction Module**: Spatial, Temporal, and NDVI derivations.
4.  **Classification Module**: Application of the selected ML/DL routing.
5.  **Evaluation Analytics**: Outputting Overall Accuracy, F1-Score, Precision, Recall, Kappa Coefficients, and Confusion Matrices.
6.  **Data Storage & Visualization Module**: Generating GeoTIFFs, PDF Reports, and dynamic interactive map overlays.

---
*Architected for scalability, precision, and global agricultural intelligence.*
