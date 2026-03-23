import requests

west, south, east, north = -122.5, 37.7, -122.4, 37.8
url = f"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox={west},{south},{east},{north}&bboxSR=4326&imageSR=4326&size=500,500&format=png&f=image"

res = requests.get(url)
print("Status:", res.status_code)
print("Content type:", res.headers.get("Content-Type"))
if res.status_code == 200:
    print("Success! Image size:", len(res.content))
else:
    print("Error:", res.text)
