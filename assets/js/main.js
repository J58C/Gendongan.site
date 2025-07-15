document.addEventListener("DOMContentLoaded", function() {
    const loadComponent = (selector, filePath) => {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                document.querySelector(selector).innerHTML = data;
                if (selector === 'body > nav') {
                    setActiveNavLink();
                }
            })
            .catch(error => console.error('Error loading component:', error));
    };

    const navPlaceholder = document.createElement('nav');
    document.body.prepend(navPlaceholder);
    loadComponent('body > nav', 'assets/components/nav.html');

    const footerPlaceholder = document.createElement('footer');
    document.body.append(footerPlaceholder);
    loadComponent('body > footer', 'assets/components/footer.html');

    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }
});