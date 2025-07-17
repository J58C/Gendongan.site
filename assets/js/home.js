document.addEventListener('DOMContentLoaded', function() {

    function updateKeyData() {
        fetch('assets/data/data.json')
            .then(response => {
                if (!response.ok) throw new Error('Jaringan bermasalah');
                return response.json();
            })
            .then(data => {
                const keyData = data.dataKunci;
                if (keyData) {
                    document.getElementById('data-penduduk').textContent = keyData.jumlahPenduduk.toLocaleString('id-ID');
                    document.getElementById('data-rw').textContent = keyData.jumlahRW;
                    document.getElementById('data-rt').textContent = keyData.jumlahRT;
                    document.getElementById('data-luas').textContent = keyData.luasWilayah;
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
        
        fetch('assets/data/Salatiga.geojson')
            .then(response => response.json())
            .then(data => {
                let gendonganLayer;
                const allKelurahan = L.geoJSON(data, {
                    filter: feature => feature.properties.LAYER === 'Kelurahan',
                    style: feature => feature.properties.OBJECTID === 0 ? styleGendongan : styleSekitar,
                }).addTo(map);

                // REVISI: Menggunakan satu metode konsisten untuk semua label
                allKelurahan.eachLayer(layer => {
                    const center = layer.getBounds().getCenter();
                    const nama = layer.feature.properties.NAMOBJ;
                    if(nama) { // Hanya buat label jika ada namanya
                        const labelIcon = L.divIcon({
                            className: 'map-label', // Satu class untuk semua
                            html: `<span>${nama}</span>`,
                            iconSize: 'auto'
                        });
                        L.marker(center, { icon: labelIcon, interactive: false }).addTo(map);
                    }
                });

                // Cari layer Gendongan untuk mengatur view
                allKelurahan.eachLayer(layer => {
                    if (layer.feature.properties.OBJECTID === 0) {
                        gendonganLayer = layer;
                    }
                });

                if (gendonganLayer) {
                    const bounds = gendonganLayer.getBounds();
                    const paddedBounds = bounds.pad(0.4); // Area pandang diperluas agar semua label muat
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