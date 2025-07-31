/**
 * Events Application
 * Main application that connects data service with UI components
 */

class EventsApp {
    constructor() {
        this.service = new EventsService();
        this.grid = new EventsGrid('events-list');
        this.currentFilters = {
            month: 'all',
            type: 'all',
            search: ''
        };
    }

    // Initialize the application
    async init() {
        try {
            // Load events data
            await this.service.loadEvents();
            
            // Set events in grid
            this.grid.setEvents(this.service.getAllEvents());
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Render initial view
            this.grid.render();
            
            // Update hero stats
            this.updateHeroStats();
            
            console.log('Events app initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize events app:', error);
            this.showError('Error loading events data');
        }
    }

    // Setup all event listeners
    setupEventListeners() {
        this.setupMonthFilters();
        this.setupTypeFilters();
        this.setupSearch();
        this.setupKeyboardShortcuts();
    }

    // Setup month filter buttons
    setupMonthFilters() {
        const monthBtns = document.querySelectorAll('.month-btn');
        monthBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                monthBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Update filter
                const month = btn.getAttribute('data-month');
                this.currentFilters.month = month;
                
                // Apply filters
                this.applyFilters();
            });
        });
    }

    // Setup type filter buttons (local/international)
    setupTypeFilters() {
        const typeBtns = document.querySelectorAll('.event-type-btn');
        typeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                typeBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Update filter
                const type = btn.getAttribute('data-type');
                this.currentFilters.type = type;
                
                // Apply filters
                this.applyFilters();
            });
        });
    }

    // Setup search functionality
    setupSearch() {
        // Add search input if it doesn't exist
        if (!document.getElementById('events-search')) {
            this.addSearchInput();
        }
        
        const searchInput = document.getElementById('events-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
            });
        }
    }

    // Add search input to the page
    addSearchInput() {
        const filterSection = document.querySelector('.month-filter-section .container');
        if (filterSection) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.innerHTML = `
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="events-search" placeholder="Buscar eventos..." />
                </div>
            `;
            filterSection.appendChild(searchContainer);
        }
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('events-search');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Escape to clear search
            if (e.key === 'Escape') {
                const searchInput = document.getElementById('events-search');
                if (searchInput && searchInput.value) {
                    searchInput.value = '';
                    this.currentFilters.search = '';
                    this.applyFilters();
                }
            }
        });
    }

    // Apply all current filters
    applyFilters() {
        let filteredEvents = this.service.getAllEvents();

        // Apply month filter
        if (this.currentFilters.month !== 'all') {
            filteredEvents = filteredEvents.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getMonth() === parseInt(this.currentFilters.month);
            });
        }

        // Apply type filter
        if (this.currentFilters.type !== 'all') {
            filteredEvents = filteredEvents.filter(event => {
                return event.tags.includes(this.currentFilters.type === 'local' ? 'local' : 'international');
            });
        }

        // Apply search filter
        if (this.currentFilters.search.trim()) {
            filteredEvents = this.service.searchEvents(this.currentFilters.search);
            
            // Combine with other filters
            if (this.currentFilters.month !== 'all') {
                filteredEvents = filteredEvents.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.getMonth() === parseInt(this.currentFilters.month);
                });
            }
            
            if (this.currentFilters.type !== 'all') {
                filteredEvents = filteredEvents.filter(event => {
                    return event.tags.includes(this.currentFilters.type === 'local' ? 'local' : 'international');
                });
            }
        }

        // Update grid with filtered events
        this.grid.setEvents(filteredEvents);
        this.grid.render();
        
        // Update results count
        this.updateResultsCount(filteredEvents.length);
    }

    // Update hero statistics
    updateHeroStats() {
        const stats = this.service.getEventStats();
        
        // Update hero stats if elements exist
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = `${stats.total}+`;
            statNumbers[1].textContent = `${stats.local}+`;
            statNumbers[2].textContent = new Date().getFullYear();
        }
    }

    // Update results count display
    updateResultsCount(count) {
        let countElement = document.getElementById('results-count');
        if (!countElement) {
            const eventsSection = document.querySelector('.events-section .container');
            if (eventsSection) {
                countElement = document.createElement('div');
                countElement.id = 'results-count';
                countElement.className = 'results-count';
                eventsSection.insertBefore(countElement, eventsSection.firstChild);
            }
        }
        
        if (countElement) {
            const totalEvents = this.service.getAllEvents().length;
            countElement.innerHTML = `
                <p>Mostrando ${count} de ${totalEvents} eventos</p>
            `;
        }
    }

    // Show error message
    showError(message) {
        const container = document.getElementById('events-list');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>⚠️ ${message}</h3>
                    <p>Por favor, intenta recargar la página</p>
                    <button onclick="location.reload()" class="cyber-btn">Recargar</button>
                </div>
            `;
        }
    }

    // Get current filters
    getCurrentFilters() {
        return { ...this.currentFilters };
    }

    // Reset all filters
    resetFilters() {
        this.currentFilters = {
            month: 'all',
            type: 'all',
            search: ''
        };
        
        // Reset UI
        document.querySelectorAll('.month-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.month-btn[data-month="all"]')?.classList.add('active');
        
        document.querySelectorAll('.event-type-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.event-type-btn[data-type="local"]')?.classList.add('active');
        
        const searchInput = document.getElementById('events-search');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reapply filters
        this.applyFilters();
    }

    // Export events data
    exportEvents(format = 'json') {
        const events = this.service.getAllEvents();
        
        if (format === 'json') {
            const dataStr = JSON.stringify(events, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'ethereum-cali-events.json';
            link.click();
            
            URL.revokeObjectURL(url);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eventsApp = new EventsApp();
    window.eventsApp.init();
});

// Export for global access
window.EventsApp = EventsApp; 