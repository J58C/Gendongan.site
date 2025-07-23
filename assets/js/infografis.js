document.addEventListener('DOMContentLoaded', () => {
    const createChart = (canvasId, chartType, data, options = {}) => {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        new Chart(ctx, { type: chartType, data: data, options: { responsive: true, maintainAspectRatio: false, ...options } });
    };

    function fetchData() {
        fetch('assets/data/data.json')
            .then(response => response.json())
            .then(data => {
                const demografi = data.demografi;
                const fasilitas = data.fasilitasSosial;

                document.getElementById('data-kepadatan').textContent = demografi.kepadatanPenduduk_per_km2.toLocaleString('id-ID');
                document.getElementById('data-rasio-jk').textContent = demografi.rasioJenisKelamin.toLocaleString('id-ID');

                createChart('grafikJenisKelamin', 'pie', {
                    labels: ['Pria', 'Wanita'],
                    datasets: [{ 
                        label: 'Jumlah',
                        data: [demografi.jumlahPria, demografi.jumlahWanita], 
                        backgroundColor: ['#36A2EB', '#FF6384'] 
                    }]
                });

                createChart('grafikPemelukAgama', 'doughnut', {
                    labels: ['Islam', 'Kristen', 'Katolik', 'Budha', 'Konghucu'],
                    datasets: [{
                        label: 'Jumlah Pemeluk',
                        data: [
                            demografi.pemelukAgama.islam,
                            demografi.pemelukAgama.kristen,
                            demografi.pemelukAgama.katolik,
                            demografi.pemelukAgama.budha,
                            demografi.pemelukAgama.konghucu
                        ],
                        backgroundColor: ['#4BC0C0', '#FF9F40', '#FF6384', '#9966FF', '#FFCD56']
                    }]
                });

                createChart('grafikTempatIbadah', 'bar', {
                    labels: ['Masjid', 'Mushola', 'Gereja'],
                    datasets: [{ 
                        label: 'Jumlah Unit',
                        data: [fasilitas.tempatIbadah.masjid, fasilitas.tempatIbadah.mushola, fasilitas.tempatIbadah.gereja], 
                        backgroundColor: ['#4BC0C0', '#9966FF', '#C9CBCF'] 
                    }]
                });

                createChart('grafikPosyandu', 'bar', {
                    labels: ['Posyandu Balita', 'Posyandu Lansia'],
                    datasets: [{ 
                        label: 'Jumlah Unit', 
                        data: [fasilitas.posyandu.balita, fasilitas.posyandu.lansia], 
                        backgroundColor: ['#36A2EB', '#FF6384'] 
                    }],
                }, { indexAxis: 'y' });
            })
            .catch(error => console.error("Gagal memuat data infografis:", error));
    }
    
    const waitForChartJs = setInterval(() => {
        if (typeof Chart !== 'undefined') {
            clearInterval(waitForChartJs);
            fetchData();
        }
    }, 100);
});