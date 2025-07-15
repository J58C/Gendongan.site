document.addEventListener("DOMContentLoaded", function() {

    const loadComponent = async (selector, filePath) => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Gagal memuat ${filePath}`);
            const data = await response.text();
            const element = document.querySelector(selector);
            if (element) element.innerHTML = data;
        } catch (error) {
            console.error('Error memuat komponen:', error);
        }
    };

    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.main-nav .nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    };

    const initializeLayout = async () => {
        await Promise.all([
            loadComponent('#header-placeholder', 'assets/components/header.html'),
            loadComponent('#navbar-placeholder', 'assets/components/navbar.html'),
            loadComponent('#footer-placeholder', 'assets/components/footer.html')
        ]);
        
        setActiveNavLink();
    };

    initializeLayout();
});