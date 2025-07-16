document.addEventListener("DOMContentLoaded", function() {

    const loadComponent = async (selector, filePath) => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, path: ${filePath}`);
            }
            const data = await response.text();
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = data;
            } else {
                console.error(`Elemen dengan selector '${selector}' tidak ditemukan.`);
            }
        } catch (error) {
            console.error(`Gagal memuat komponen dari '${filePath}'.`, error);
        }
    };

    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.header-nav .nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    };

    const initializeLayout = async () => {
        await loadComponent('#header-placeholder', 'assets/components/header.html');
        await loadComponent('#footer-placeholder', 'assets/components/footer.html');
        
        setActiveNavLink();
    };

    initializeLayout();
});