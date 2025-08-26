/**
 * Events App - Main application logic for events pages
 */

class EventsApp {
    constructor() {
        this.eventsService = new EventsService();
        this.eventsUI = new EventsUI(this.eventsService);
        this.currentPage = this.detectCurrentPage();
        this.events = [];
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('events_internationals')) return 'international';
        if (path.includes('events_locales')) return 'local';
        return 'unknown';
    }

    async initialize() {
        try {
            if (this.currentPage === 'international') {
                await this.initializeInternationalPage();
            } else if (this.currentPage === 'local') {
                await this.initializeLocalPage();
            }
        } catch (error) {
            console.error('Error initializing events app:', error);
        }
    }

    async initializeInternationalPage() {
        // Load international events
        this.events = await this.eventsService.loadInternationalEvents();
        
        // Render events
        this.eventsUI.renderInternationalEvents(this.events);
        
        // Calculate and render metrics
        const metrics = this.eventsService.getInternationalMetrics(this.events);
        this.eventsUI.renderInternationalMetrics(metrics);
        
        // Setup month filtering
        this.eventsUI.setupMonthFilter(this.events, (filteredEvents) => {
            this.eventsUI.renderInternationalEvents(filteredEvents);
        });
        
        // Setup event type filtering if exists
        this.setupEventTypeFilter();
        
        console.log(`Loaded ${this.events.length} international events`);
    }

    async initializeLocalPage() {
        // Load local events
        this.events = await this.eventsService.loadLocalEvents();
        
        // Render events
        this.eventsUI.renderLocalEvents(this.events);
        
        // Calculate and render metrics
        const metrics = this.eventsService.getLocalMetrics(this.events);
        this.eventsUI.renderLocalMetrics(metrics);
        
        // Setup filtering (year and month)
        this.eventsUI.setupFilters(this.events, (filteredEvents) => {
            this.eventsUI.renderLocalEvents(filteredEvents);
        });
        
        // Setup event type filtering if exists
        this.setupEventTypeFilter();
        
        console.log(`Loaded ${this.events.length} local events`);
    }

    setupEventTypeFilter() {
        const eventTypeBtns = document.querySelectorAll('.event-type-btn');
        
        if (!eventTypeBtns.length) return;
        
        eventTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                eventTypeBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                const selectedType = btn.getAttribute('data-type');
                
                if (this.currentPage === 'international') {
                    // For international page, this might toggle between different views
                    this.handleInternationalTypeFilter(selectedType);
                } else if (this.currentPage === 'local') {
                    // For local page, this shows all local events
                    this.handleLocalTypeFilter(selectedType);
                }
            });
        });
    }

    handleInternationalTypeFilter(selectedType) {
        // Show international events when international is selected
        if (selectedType === 'international') {
            this.eventsUI.renderInternationalEvents(this.events);
        } else if (selectedType === 'local') {
            // Redirect to local events page or show message
            window.location.href = 'events_locales.html';
        }
    }

    handleLocalTypeFilter(selectedType) {
        // Show local events when local is selected
        if (selectedType === 'local') {
            this.eventsUI.renderLocalEvents(this.events);
        } else if (selectedType === 'international') {
            // Redirect to international events page
            window.location.href = 'events_internationals.html';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new EventsApp();
    app.initialize();
});

// Export for global access
window.EventsApp = EventsApp;