document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.settings-tab');
    const sections = document.querySelectorAll('.settings-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and sections
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Show corresponding section
            const targetSection = document.getElementById(tab.dataset.tab);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}); 