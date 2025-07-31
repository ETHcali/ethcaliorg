/**
 * Events UI Components
 * Modular components for rendering event cards and related UI elements
 */

class EventCard {
    constructor(event) {
        this.event = event;
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        };
        return date.toLocaleDateString('es-ES', options);
    }

    // Get event type badge class
    getTypeBadgeClass() {
        const typeMap = {
            'Event': 'event-badge',
            'Meetup': 'meetup-badge',
            'Workshop': 'workshop-badge',
            'Conference': 'conference-badge',
            'Hackathon': 'hackathon-badge'
        };
        return typeMap[this.event.type] || 'default-badge';
    }

    // Get category badge class
    getCategoryBadgeClass() {
        const categoryMap = {
            'Own': 'own-badge',
            'Colab': 'colab-badge',
            'Volunteering': 'volunteering-badge',
            'Attendees': 'attendees-badge',
            'Ethcolombia': 'ethcolombia-badge'
        };
        return categoryMap[this.event.category] || 'default-badge';
    }

    // Render event stats
    renderStats() {
        const stats = [];
        
        if (this.event.stats.rsvp > 0) {
            stats.push(`<span class="stat-item"><i class="fa fa-users"></i> RSVP: ${this.event.stats.rsvp}</span>`);
        }
        
        if (this.event.stats.poapCollectors > 0) {
            stats.push(`<span class="stat-item"><i class="fa fa-gift"></i> POAP: ${this.event.stats.poapCollectors}</span>`);
        }
        
        return stats.length > 0 ? `<div class="event-stats">${stats.join('')}</div>` : '';
    }

    // Render event links
    renderLinks() {
        const links = [];
        
        if (this.event.links.instagram) {
            links.push(`<a href="${this.event.links.instagram}" target="_blank" class="link-item"><i class="fab fa-instagram"></i> Instagram</a>`);
        }
        
        if (this.event.links.registration && this.event.links.registration !== 'NA') {
            links.push(`<a href="${this.event.links.registration}" target="_blank" class="link-item"><i class="fa fa-calendar-plus"></i> Registration</a>`);
        }
        
        if (this.event.links.recap) {
            links.push(`<a href="${this.event.links.recap}" target="_blank" class="link-item"><i class="fa fa-play-circle"></i> Recap</a>`);
        }
        
        if (this.event.media.youtube) {
            links.push(`<a href="${this.event.media.youtube}" target="_blank" class="link-item"><i class="fab fa-youtube"></i> YouTube</a>`);
        }
        
        return links.length > 0 ? `<div class="event-links">${links.join('')}</div>` : '';
    }

    // Render collaboration info
    renderCollaboration() {
        if (!this.event.collaboration.name) return '';
        
        const url = this.event.collaboration.url || '#';
        return `
            <div class="event-collab">
                <i class="fa fa-handshake"></i> 
                <a href="${url}" target="_blank">${this.event.collaboration.name}</a>
            </div>
        `;
    }

    // Render location info
    renderLocation() {
        const location = this.event.location;
        const mapsUrl = location.mapsUrl || '#';
        
        return `
            <div class="event-location">
                <i class="fa fa-map-marker"></i> 
                <a href="${mapsUrl}" target="_blank">${location.name}, ${location.address}</a>
            </div>
        `;
    }

    // Get main action link
    getMainActionLink() {
        return this.event.links.main || this.event.links.instagram || this.event.links.registration || '#';
    }

    // Render the complete event card
    render() {
        const mainLink = this.getMainActionLink();
        const hasValidLink = mainLink && mainLink !== '#';
        
        return `
            <div class="event-card" data-event-id="${this.event.id}" data-type="${this.event.tags.includes('international') ? 'international' : 'local'}">
                <img src="${this.event.media.image}" alt="${this.event.name}" class="event-image">
                
                <div class="event-card-header">
                    <h3>${this.event.name}</h3>
                    <div class="event-date">
                        <i class="fa fa-calendar"></i> 
                        ${this.formatDate(this.event.date)}
                    </div>
                    <div class="event-type-badge ${this.getTypeBadgeClass()}">${this.event.type}</div>
                    <div class="event-category-badge ${this.getCategoryBadgeClass()}">${this.event.category}</div>
                </div>
                
                <div class="event-card-body">
                    ${this.renderLocation()}
                    ${this.renderCollaboration()}
                    ${this.renderStats()}
                    ${this.renderLinks()}
                </div>
                
                <div class="event-card-footer">
                    <a href="${mainLink}" class="btn-discover" target="_blank" ${!hasValidLink ? 'style="background: #666; cursor: not-allowed;"' : ''}>
                        <span>${hasValidLink ? 'Ver más' : 'Coming Soon'}</span>
                        <i class="fas fa-${hasValidLink ? 'external-link-alt' : 'clock'}"></i>
                    </a>
                </div>
            </div>
        `;
    }
}

// Events Grid Component
class EventsGrid {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.events = [];
        this.filteredEvents = [];
    }

    // Set events data
    setEvents(events) {
        this.events = events;
        this.filteredEvents = [...events];
    }

    // Filter events by month
    filterByMonth(month) {
        if (month === 'all') {
            this.filteredEvents = [...this.events];
        } else {
            this.filteredEvents = this.events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getMonth() === parseInt(month);
            });
        }
        this.render();
    }

    // Filter events by type (local/international)
    filterByType(type) {
        if (type === 'all') {
            this.filteredEvents = [...this.events];
        } else {
            this.filteredEvents = this.events.filter(event => {
                return event.tags.includes(type === 'local' ? 'local' : 'international');
            });
        }
        this.render();
    }

    // Search events by name or tags
    searchEvents(query) {
        if (!query.trim()) {
            this.filteredEvents = [...this.events];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredEvents = this.events.filter(event => {
                return event.name.toLowerCase().includes(searchTerm) ||
                       event.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                       event.type.toLowerCase().includes(searchTerm) ||
                       event.category.toLowerCase().includes(searchTerm);
            });
        }
        this.render();
    }

    // Render the events grid
    render() {
        if (!this.container) {
            console.error('Events container not found');
            return;
        }

        if (this.filteredEvents.length === 0) {
            this.container.innerHTML = `
                <div class="no-events-message">
                    <h3>No se encontraron eventos</h3>
                    <p>Intenta con otros filtros o busca algo diferente.</p>
                </div>
            `;
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'events-grid';

        this.filteredEvents.forEach(event => {
            const eventCard = new EventCard(event);
            grid.innerHTML += eventCard.render();
        });

        this.container.innerHTML = '';
        this.container.appendChild(grid);
    }

    // Get event statistics
    getStats() {
        const total = this.events.length;
        const local = this.events.filter(e => e.tags.includes('local')).length;
        const international = this.events.filter(e => e.tags.includes('international')).length;
        const meetups = this.events.filter(e => e.type === 'Meetup').length;
        const workshops = this.events.filter(e => e.type === 'Workshop').length;
        const conferences = this.events.filter(e => e.type === 'Conference').length;
        const events = this.events.filter(e => e.type === 'Event').length;

        return {
            total,
            local,
            international,
            meetups,
            workshops,
            conferences,
            events
        };
    }
}

// Export for use in other modules
window.EventCard = EventCard;
window.EventsGrid = EventsGrid; 