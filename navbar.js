/**
 * Ethereum Cali - Navbar Module
 * Simple navbar loading and interactions
 */

(function() {
    // Ensure DOM is fully loaded
    function domReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    // Load navbar function
    function loadNavbar() {
        const navbarContainer = document.getElementById('navbar-container');
        if (!navbarContainer) {
            console.error('Navbar container not found. Please add <div id="navbar-container"></div> to your HTML.');
            return;
        }

        // Fallback content in case fetch fails
        const fallbackNavbar = `
            <nav class="navbar">
                <div class="navbar-brand">
                    <a href="/ethcali.html" class="navbar-logo">Ethereum Cali</a>
                </div>
                <div class="nav-links">
                    <a href="/ethcali.html" class="nav-link">Home</a>
                    <a href="/events.html" class="nav-link">Events</a>
                    <a href="/about.html" class="nav-link">About</a>
                    <a href="/ethcalivenues.html" class="nav-link">Venues</a>
                </div>
            </nav>
        `;

        fetch('navbar.html')
            .then(response => {
                if (!response.ok) {
                    console.warn('Failed to fetch navbar, using fallback');
                    navbarContainer.innerHTML = fallbackNavbar;
                    return null;
                }
                return response.text();
            })
            .then(html => {
                if (html) {
                    navbarContainer.innerHTML = html;
                }
                setupNavbarInteractions();
            })
            .catch(error => {
                console.error('Navbar loading error:', error);
                navbarContainer.innerHTML = fallbackNavbar;
                setupNavbarInteractions();
            });
    }

    // Setup navbar interactions
    function setupNavbarInteractions() {
        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        const walletBtn = document.getElementById('wallet-connect');
        const walletStatus = document.getElementById('wallet-status');

        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-active');
                mobileToggle.classList.toggle('active');
            });
        }

        // Wallet connect logic
        if (walletBtn && window.ethereum) {
            walletBtn.addEventListener('click', async () => {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    if (accounts && accounts[0]) {
                        const short = accounts[0].slice(0, 6) + '...' + accounts[0].slice(-4);
                        walletStatus.textContent = short;
                        walletBtn.classList.add('connected');
                    }
                } catch (err) {
                    walletStatus.textContent = 'Error';
                }
            });
        } else if (walletBtn) {
            walletBtn.addEventListener('click', () => {
                walletStatus.textContent = 'No wallet';
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
        } else if (currentFile.includes('ethcali')) {
            const homeLink = document.querySelector('a[href="ethcali.html"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }

    // Initialize
    domReady(loadNavbar);
})();

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