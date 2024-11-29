document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const body = document.body;
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    // Toggle menu
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSidebar();
    });

    // Function to close sidebar
    function closeSidebar() {
        sidebar.classList.remove('active');
        menuToggle.classList.remove('active');
        body.style.overflow = '';
    }

    // Function to toggle sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        menuToggle.classList.toggle('active');
        body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            if (sidebar.classList.contains('active')) {
                closeSidebar();
            }
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });

    // Prevent clicks inside sidebar from closing it
    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Close sidebar when nav link is clicked (mobile only)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                // Add small delay to allow the page content to load
                setTimeout(closeSidebar, 150);
            }
        });
    });
}); 