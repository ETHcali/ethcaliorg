/**
 * Ethereum Cali - Navbar Module
 * Professional navbar functionality with wallet integration
 */

document.addEventListener('DOMContentLoaded', function() {
    // Navbar loading function
    function loadNavbar() {
        const navbarContainer = document.getElementById('navbar-container');
        if (!navbarContainer) {
            console.error('Navbar container not found');
            return;
        }

        fetch('navbar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                navbarContainer.innerHTML = html;
                setupNavbarInteractions();
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
                navbarContainer.innerHTML = `<div class="error-message">Failed to load navbar: ${error.message}</div>`;
            });
    }

    // Setup navbar interactions
    function setupNavbarInteractions() {
        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-active');
                mobileToggle.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                const navLinks = document.querySelector('.nav-links');
                const mobileToggle = document.querySelector('.mobile-menu-toggle');
                if (navLinks && mobileToggle) {
                    navLinks.classList.remove('mobile-active');
                    mobileToggle.classList.remove('active');
                }
            }
        });

        // Set active page
        setActivePage();
    }

    // Set active page based on current URL
    function setActivePage() {
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop() || 'ethcali.html';
        
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Set active class based on current page
        if (currentFile.includes('events')) {
            const eventsLink = document.querySelector('a[href="events.html"]');
            if (eventsLink) eventsLink.classList.add('active');
        } else if (currentFile.includes('about')) {
            const aboutLink = document.querySelector('a[href="about.html"]');
            if (aboutLink) aboutLink.classList.add('active');
        } else if (currentFile.includes('venues')) {
            const venuesLink = document.querySelector('a[href="ethcalivenues.html"]');
            if (venuesLink) venuesLink.classList.add('active');
        }
    }

    // Load navbar
    loadNavbar();
});

// Footer Module
class EthereumCaliFooter {
    constructor() {
        this.init();
    }

    async init() {
        try {
            await this.loadFooter();
        } catch (error) {
            console.error('Error initializing footer:', error);
        }
    }

    async loadFooter() {
        return new Promise((resolve, reject) => {
            const footerContainer = document.getElementById('footer-container');
            if (!footerContainer) {
                reject(new Error('Footer container not found'));
                return;
            }

            fetch('footer.html')
                .then(response => response.text())
                .then(html => {
                    footerContainer.innerHTML = html;
                    resolve();
                })
                .catch(error => reject(error));
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EthereumCaliFooter();
});

// Export for potential use in other scripts
window.EthereumCaliFooter = EthereumCaliFooter; 