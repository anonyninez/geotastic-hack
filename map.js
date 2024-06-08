let map; // Declare map variable outside the event listener

window.addEventListener('message', (event) => {
    let zoom = 3;
    let data = event.data;
    // console.log("map.js received data:", data);
    
    // Check if the map is already initialized
    if (!map) {
        map = L.map('map').setView([data.lat, data.lon], zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        map.setView([data.lat, data.lon], zoom);
    }

    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    var marker = L.marker([data.lat, data.lon]).addTo(map);
    marker.bindPopup(`<b>${data.code}</b>`).openPopup();
});
