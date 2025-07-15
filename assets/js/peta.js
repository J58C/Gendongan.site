document.addEventListener('DOMContentLoaded', function() {
    const petaContainer = document.getElementById('peta-detail');

    if (!petaContainer) {
        return;
    }

    const map = L.map(petaContainer).setView([-7.3365, 110.5108], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const styleGendongan = { color: "#e60000", weight: 3, opacity: 1, fillColor: "#e60000", fillOpacity: 0.3 };
    const styleKelurahanLain = { color: "#ff7800", weight: 2, opacity: 0.8, fillColor: "#ff7800", fillOpacity: 0.1 };
    const styleRW = { color: "#005eff", weight: 2, opacity: 0.7, fillColor: "#005eff", fillOpacity: 0.2 };

    const kelurahanLayer = L.layerGroup();
    const rwLayer = L.layerGroup();
    const markerLayer = L.layerGroup();

    fetch('assets/data/Salatiga.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: function(feature) {
                    switch (feature.properties.LAYER) {
                        case 'Kelurahan':
                            return feature.properties.OBJECTID === 0 ? styleGendongan : styleKelurahanLain;
                        case 'RW':
                            return styleRW;
                    }
                },
                onEachFeature: function(feature, layer) {
                    const nama = feature.properties.NAMOBJ || 'Wilayah';
                    layer.bindPopup(`<b>${nama}</b>`);

                    if (feature.properties.LAYER === 'Kelurahan') {
                        layer.addTo(kelurahanLayer);
                    } else if (feature.properties.LAYER === 'RW') {
                        layer.addTo(rwLayer);
                    }
                }
            });

            kelurahanLayer.addTo(map);
            rwLayer.addTo(map);
            markerLayer.addTo(map);
        })
        .catch(error => console.error('Gagal memuat Salatiga.geojson:', error));

    const lokasiPentingData = [
        { nama: "Kantor Kelurahan Gendongan", lat: -7.3365, lng: 110.5108 },
        { nama: "SDN Gendongan 01", lat: -7.3350, lng: 110.5115 },
        { nama: "Puskesmas Pembantu", lat: -7.3380, lng: 110.5090 }
    ];

    lokasiPentingData.forEach(lokasi => {
        L.marker([lokasi.lat, lokasi.lng]).bindPopup(`<b>${lokasi.nama}</b>`).addTo(markerLayer);
    });

    const overlayMaps = {
        "Batas Kelurahan": kelurahanLayer,
        "Batas RW": rwLayer,
        "Lokasi Penting": markerLayer
    };

    L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);
});