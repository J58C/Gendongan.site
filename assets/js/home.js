document.addEventListener('DOMContentLoaded', function() {

    function updateKeyData() {
        fetch('assets/data/data.json')
            .then(response => {
                if (!response.ok) throw new Error('Jaringan bermasalah');
                return response.json();
            })
            .then(data => {
                const keyData = data.profilUtama;
                if (keyData) {
                    document.getElementById('data-penduduk').textContent = keyData.jumlahPenduduk_total.toLocaleString('id-ID');
                    document.getElementById('data-rw').textContent = keyData.jumlahRW;
                    document.getElementById('data-rt').textContent = keyData.jumlahRT;
                    document.getElementById('data-luas').textContent = `${keyData.luasWilayah_km2} km²`;
                }
            })
            .catch(error => console.error('Gagal memuat data kunci:', error));
    }

    function initializeStaticMap() {
        const petaContainer = document.getElementById('peta-lokasi');
        if (!petaContainer) return;

        const map = L.map(petaContainer);

        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        if (map.zoomControl) {
            map.zoomControl.remove();
        }

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        const styleGendongan = { color: "#e60000", weight: 3, opacity: 1, fillColor: "#e60000", fillOpacity: 0.3 };
        const styleSekitar = { color: "#6c757d", weight: 2, opacity: 0.7, fillColor: "#6c757d", fillOpacity: 0.1 };
        const styleHighlight = { color: "#007bff", weight: 3, opacity: 1, fillColor: "#007bff", fillOpacity: 0.3 };
        
        let previouslyClickedLayer = null;
        let gendonganLayer = null;

        function resetMapFocus() {
            if (previouslyClickedLayer) {
                previouslyClickedLayer.setStyle(styleSekitar);
                previouslyClickedLayer = null;
            }
            if (gendonganLayer) {
                const bounds = gendonganLayer.getBounds();
                const paddedBounds = bounds.pad(0.4);
                map.fitBounds(paddedBounds);
            }
        }
        
        fetch('assets/data/Salatiga.geojson')
            .then(response => response.json())
            .then(data => {
                const allKelurahan = L.geoJSON(data, {
                    filter: feature => feature.properties.LAYER === 'Kelurahan',
                    style: feature => feature.properties.OBJECTID === 0 ? styleGendongan : styleSekitar,
                    onEachFeature: (feature, layer) => {
                        const nama = feature.properties.NAMOBJ || 'Wilayah';
                        
                        if (feature.properties.OBJECTID === 0) {
                            gendonganLayer = layer;
                            layer.bindTooltip(nama, {
                                permanent: true,
                                direction: 'center',
                                className: 'map-label-center'
                            }).openTooltip();
                        } else {
                            layer.bindPopup(`<b>${nama}</b>`);
                            layer.on('click', (e) => {
                                if (previouslyClickedLayer) {
                                    previouslyClickedLayer.setStyle(styleSekitar);
                                }
                                e.target.setStyle(styleHighlight);
                                previouslyClickedLayer = e.target;
                            });
                            layer.on('popupclose', resetMapFocus);
                        }
                    }
                }).addTo(map);

                map.on('click', resetMapFocus);

                if (gendonganLayer) {
                    const bounds = gendonganLayer.getBounds();
                    const paddedBounds = bounds.pad(0.4);
                    map.fitBounds(paddedBounds);
                } else {
                    map.fitBounds(allKelurahan.getBounds());
                }
            })
            .catch(error => console.error('Gagal memuat Salatiga.geojson:', error));
    }

    updateKeyData();
    initializeStaticMap();
});