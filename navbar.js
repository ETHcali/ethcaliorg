/**
 * Ethereum Cali - Navbar Module
 * Professional navbar functionality with wallet integration
 */

class EthereumCaliNavbar {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.userAddress = null;
        this.walletBtn = null;
        this.walletStatus = null;
        this.currentPage = null;
        
        this.init();
    }

    async init() {
        try {
            await this.loadNavbar();
            this.setupEventListeners();
            this.setActivePage();
            this.checkWalletConnection();
        } catch (error) {
            console.error('Error initializing navbar:', error);
        }
    }

    async loadNavbar() {
        return new Promise((resolve, reject) => {
            const navbarContainer = document.getElementById('navbar-container');
            if (!navbarContainer) {
                reject(new Error('Navbar container not found'));
                return;
            }

            fetch('navbar.html')
                .then(response => response.text())
                .then(html => {
                    navbarContainer.innerHTML = html;
                    
                    // Initialize wallet elements after navbar is loaded
                    this.walletBtn = document.getElementById('wallet-connect');
                    this.walletStatus = document.getElementById('wallet-status');
                    
                    resolve();
                })
                .catch(error => reject(error));
        });
    }

    setupEventListeners() {
        // Wallet connection
        if (this.walletBtn) {
            this.walletBtn.addEventListener('click', () => this.connectWallet());
        }

        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-active');
                mobileToggle.classList.toggle('active');
            });
        }

        // Ethereum wallet events
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', (accounts) => this.handleAccountsChanged(accounts));
            window.ethereum.on('chainChanged', () => this.handleChainChanged());
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
    }

    setActivePage() {
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
        } else {
            // For ethcali.html or root, we don't set any specific active state
            // since it uses anchor navigation
        }
    }

    async connectWallet() {
        if (typeof window.ethereum === 'undefined') {
            this.showWalletError('Por favor instala MetaMask para conectar tu wallet');
            return;
        }

        try {
            // Show loading state
            this.updateWalletStatus('Conectando...', false);

            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Create provider and signer
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            this.userAddress = await this.signer.getAddress();
            
            // Resolve ENS name
            const displayName = await this.resolveDisplayName(this.userAddress);
            
            // Update UI
            this.updateWalletStatus(displayName, true);
            
        } catch (error) {
            console.error('Error connecting wallet:', error);
            this.updateWalletStatus('Error al conectar', false);
            
            // Reset to default state after 3 seconds
            setTimeout(() => {
                this.updateWalletStatus('Conectar Wallet', false);
            }, 3000);
        }
    }

    async resolveDisplayName(address) {
        try {
            const ensName = await this.provider.lookupAddress(address);
            if (ensName) {
                return ensName;
            }
        } catch (error) {
            console.log('ENS lookup failed:', error);
        }
        
        // Return shortened address if no ENS
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    updateWalletStatus(text, isConnected) {
        if (this.walletStatus) {
            this.walletStatus.textContent = text;
        }
        
        if (this.walletBtn) {
            if (isConnected) {
                this.walletBtn.classList.add('connected');
            } else {
                this.walletBtn.classList.remove('connected');
            }
        }
    }

    showWalletError(message) {
        alert(message);
    }

    handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            // User disconnected
            this.updateWalletStatus('Conectar Wallet', false);
            this.userAddress = null;
        } else {
            // User switched accounts
            this.connectWallet();
        }
    }

    handleChainChanged() {
        // Reload the page when chain changes for simplicity
        window.location.reload();
    }

    async checkWalletConnection() {
        if (typeof window.ethereum === 'undefined') return;

        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                // Auto-connect if previously connected
                await this.connectWallet();
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
        }
    }
}

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
    new EthereumCaliNavbar();
    new EthereumCaliFooter();
});

// Export for potential use in other scripts
window.EthereumCaliNavbar = EthereumCaliNavbar;
window.EthereumCaliFooter = EthereumCaliFooter; 