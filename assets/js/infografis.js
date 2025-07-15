function initializeCharts() {
    const chartData = {
        jenisKelamin: { labels: ['Pria', 'Wanita'], data: [6120, 6225] },
        kelompokUsia: { labels: ['0-17 th', '18-35 th', '36-55 th', '55+ th'], data: [2500, 4500, 3845, 1500] },
        pendidikan: { labels: ['SD', 'SMP', 'SMA/SMK', 'Diploma', 'Sarjana', 'Lainnya'], data: [2000, 3100, 4500, 1500, 1245, 100] },
        pekerjaan: { labels: ['Swasta', 'Wirausaha', 'PNS/TNI/Polri', 'Pelajar', 'Lainnya'], data: [5200, 2500, 800, 2845, 1000] }
    };
    const createChart = (canvasId, chartType, data, extraOptions = {}) => {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.error(`Elemen canvas dengan id '${canvasId}' tidak ditemukan.`);
            return;
        }
        new Chart(ctx, {
            type: chartType,
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
                ...extraOptions
            }
        });
    };

    createChart('grafikJenisKelamin', 'pie', {
        labels: chartData.jenisKelamin.labels,
        datasets: [{ data: chartData.jenisKelamin.data, backgroundColor: ['#36A2EB', '#FF6384'] }]
    });

    createChart('grafikKelompokUsia', 'bar', {
        labels: chartData.kelompokUsia.labels,
        datasets: [{ label: 'Jumlah Penduduk', data: chartData.kelompokUsia.data, backgroundColor: '#4BC0C0' }]
    });

    createChart('grafikPendidikan', 'doughnut', {
        labels: chartData.pendidikan.labels,
        datasets: [{ data: chartData.pendidikan.data, backgroundColor: ['#17a2b8', '#6610f2', '#6f42c1', '#e83e8c', '#20c997', '#6c757d'] }]
    });

    createChart('grafikPekerjaan', 'bar', {
        labels: chartData.pekerjaan.labels,
        datasets: [{ label: 'Jumlah', data: chartData.pekerjaan.data, backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'] }]
    }, { indexAxis: 'y' });
}

const waitForChartJs = setInterval(() => {
    if (typeof Chart !== 'undefined') {
        clearInterval(waitForChartJs);
        initializeCharts();
    }
}, 100);