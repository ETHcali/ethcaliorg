/**
 * Events Service
 * Handles data loading and management for events
 */

class EventsService {
    constructor() {
        this.events = [];
        this.metadata = {};
        this.isLoaded = false;
    }

    // Load events from JSON file
    async loadEvents() {
        try {
            const response = await fetch('data/events.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.events = data.events || [];
            this.metadata = data.metadata || {};
            this.isLoaded = true;
            
            console.log(`Loaded ${this.events.length} events`);
            return this.events;
            
        } catch (error) {
            console.error('Error loading events:', error);
            this.events = [];
            this.isLoaded = false;
            throw error;
        }
    }

    // Get all events
    getAllEvents() {
        return this.events;
    }

    // Get events by type
    getEventsByType(type) {
        return this.events.filter(event => event.type === type);
    }

    // Get events by category
    getEventsByCategory(category) {
        return this.events.filter(event => event.category === category);
    }

    // Get events by tag
    getEventsByTag(tag) {
        return this.events.filter(event => event.tags.includes(tag));
    }

    // Get events by date range
    getEventsByDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= start && eventDate <= end;
        });
    }

    // Get events by year
    getEventsByYear(year) {
        return this.events.filter(event => {
            const eventYear = new Date(event.date).getFullYear();
            return eventYear === year;
        });
    }

    // Get events by month
    getEventsByMonth(month, year = new Date().getFullYear()) {
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getMonth() === month && eventDate.getFullYear() === year;
        });
    }

    // Search events by text
    searchEvents(query) {
        const searchTerm = query.toLowerCase();
        
        return this.events.filter(event => {
            return event.name.toLowerCase().includes(searchTerm) ||
                   event.location.name.toLowerCase().includes(searchTerm) ||
                   event.location.address.toLowerCase().includes(searchTerm) ||
                   event.collaboration.name.toLowerCase().includes(searchTerm) ||
                   event.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                   event.type.toLowerCase().includes(searchTerm) ||
                   event.category.toLowerCase().includes(searchTerm);
        });
    }

    // Get event by ID
    getEventById(id) {
        return this.events.find(event => event.id === id);
    }

    // Get upcoming events
    getUpcomingEvents() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Get past events
    getPastEvents() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate < today;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Get event statistics
    getEventStats() {
        const total = this.events.length;
        const local = this.events.filter(e => e.tags.includes('local')).length;
        const international = this.events.filter(e => e.tags.includes('international')).length;
        
        const typeStats = {};
        this.events.forEach(event => {
            typeStats[event.type] = (typeStats[event.type] || 0) + 1;
        });
        
        const categoryStats = {};
        this.events.forEach(event => {
            categoryStats[event.category] = (categoryStats[event.category] || 0) + 1;
        });
        
        const yearStats = {};
        this.events.forEach(event => {
            const year = new Date(event.date).getFullYear();
            yearStats[year] = (yearStats[year] || 0) + 1;
        });
        
        return {
            total,
            local,
            international,
            byType: typeStats,
            byCategory: categoryStats,
            byYear: yearStats
        };
    }

    // Get unique tags
    getUniqueTags() {
        const tags = new Set();
        this.events.forEach(event => {
            event.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }

    // Get unique locations
    getUniqueLocations() {
        const locations = new Set();
        this.events.forEach(event => {
            locations.add(event.location.name);
        });
        return Array.from(locations).sort();
    }

    // Get unique collaborators
    getUniqueCollaborators() {
        const collaborators = new Set();
        this.events.forEach(event => {
            if (event.collaboration.name) {
                collaborators.add(event.collaboration.name);
            }
        });
        return Array.from(collaborators).sort();
    }

    // Check if data is loaded
    isDataLoaded() {
        return this.isLoaded;
    }

    // Get metadata
    getMetadata() {
        return this.metadata;
    }

    // Reload events (useful for updates)
    async reloadEvents() {
        this.isLoaded = false;
        return await this.loadEvents();
    }
}

// Export for use in other modules
window.EventsService = EventsService; 