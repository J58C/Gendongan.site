document.addEventListener('DOMContentLoaded', function() {
    const petaContainer = document.getElementById('peta-detail');

    if (!petaContainer) {
        return;
    }

    const map = L.map(petaContainer).setView([-7.3365, 110.5108], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const styleKelurahan = { color: "#e60000", weight: 3, opacity: 0.8, fillOpacity: 0.1 };
    const styleRW = { color: "#005eff", weight: 2, opacity: 0.7, fillOpacity: 0.2 };

    const layerGroups = {
        kelurahan: L.layerGroup(),
        rw: L.layerGroup()
    };
    
    fetch('assets/data/gendongan.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: feature => feature.properties.LAYER === 'Kelurahan' ? styleKelurahan : styleRW,
                onEachFeature: (feature, layer) => {
                    const nama = feature.properties.NAMOBJ || 'Batas Wilayah';
                    layer.bindPopup(`<b>${nama}</b>`);
                    if (feature.properties.LAYER === 'Kelurahan') layer.addTo(layerGroups.kelurahan);
                    else if (feature.properties.LAYER === 'RW') layer.addTo(layerGroups.rw);
                }
            });
            layerGroups.kelurahan.addTo(map);
            layerGroups.rw.addTo(map);
        })
        .catch(error => console.error('Gagal memuat gendongan.geojson:', error));

    const lokasiPentingData = [
        { nama: "Kantor Kelurahan Gendongan", lat: -7.3365, lng: 110.5108 },
        { nama: "SDN Gendongan 01", lat: -7.3350, lng: 110.5115 },
        { nama: "Puskesmas Pembantu", lat: -7.3380, lng: 110.5090 }
    ];

    const markerLayer = L.layerGroup();
    lokasiPentingData.forEach(lokasi => {
        L.marker([lokasi.lat, lokasi.lng]).bindPopup(`<b>${lokasi.nama}</b>`).addTo(markerLayer);
    });
    markerLayer.addTo(map);

    const overlayMaps = {
        "Batas Kelurahan": layerGroups.kelurahan,
        "Batas RW": layerGroups.rw,
        "Lokasi Penting": markerLayer
    };

    L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);
});