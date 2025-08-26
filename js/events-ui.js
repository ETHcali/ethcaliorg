/**
 * Events UI - Handles rendering of event cards and UI interactions
 */

class EventsUI {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }

    renderInternationalEvents(events, containerId = 'events-list') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        
        events.forEach(event => {
            const eventCard = this.createInternationalEventCard(event);
            container.appendChild(eventCard);
        });
    }

    createInternationalEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card international-event';
        card.setAttribute('data-month', event.month);
        
        card.innerHTML = `
            <div class="event-card-header">
                <h3>${event.name}</h3>
                <div class="event-date">
                    <i class="fa fa-calendar"></i> 
                    ${this.formatDateRange(event.startDate, event.endDate)}
                </div>
                <div class="event-type-badge">International Event</div>
            </div>
            <div class="event-card-body">
                <div class="event-location">
                    <i class="fa fa-map-marker"></i> 
                    ${event.location}
                </div>
                ${event.social ? `
                    <div class="event-social">
                        <i class="fab fa-twitter"></i> 
                        <a href="https://twitter.com/${event.social}" target="_blank">@${event.social}</a>
                    </div>
                ` : ''}
                ${event.chat && event.chat !== '-' ? `
                    <div class="event-chat">
                        <i class="fab fa-telegram"></i> 
                        <a href="${event.chat}" target="_blank">Chat</a>
                    </div>
                ` : ''}
            </div>
            <div class="event-card-footer">
                ${event.link ? `
                    <a href="${this.ensureHttps(event.link)}" class="btn-discover" target="_blank">
                        Ver más
                    </a>
                ` : '<span class="btn-discover disabled">Sin enlace</span>'}
            </div>
        `;
        
        return card;
    }

    renderLocalEvents(events, containerId = 'events-list') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        
        events.forEach(event => {
            const eventCard = this.createLocalEventCard(event);
            container.appendChild(eventCard);
        });
    }

    createLocalEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card local-event';
        card.setAttribute('data-month', event.month);
        card.setAttribute('data-year', event.year);
        
        card.innerHTML = `
            <img src="${event.image}" alt="${event.name}" class="event-image" 
                 onerror="this.src='branding/logoethcali.png'">
            <div class="event-card-header">
                <h3>${event.name}</h3>
                <div class="event-date">
                    <i class="fa fa-calendar"></i> 
                    ${event.date}
                </div>
                <div class="event-type-badges">
                    <span class="event-type-content">${event.typeContent}</span>
                    <span class="event-type-event">${event.typeEvent}</span>
                </div>
            </div>
            <div class="event-card-body">
                <div class="event-location">
                    <i class="fa fa-map-marker"></i> 
                    ${event.locationUrl ? 
                        `<a href="${event.locationUrl}" target="_blank">${event.locationName}</a>` : 
                        event.locationName}
                </div>
                ${event.hostColab ? `
                    <div class="event-collab">
                        <i class="fa fa-handshake"></i> 
                        ${event.hostColab}
                    </div>
                ` : ''}
                ${event.rsvp ? `
                    <div class="event-stats">
                        <span class="stat-item">
                            <i class="fa fa-users"></i> RSVP: ${event.rsvp}
                        </span>
                        ${event.poapLink ? `
                            <span class="stat-item">
                                <i class="fa fa-gift"></i> 
                                <a href="${event.poapLink}" target="_blank">POAP</a>
                            </span>
                        ` : ''}
                    </div>
                ` : ''}
                
                <!-- Details Toggle -->
                <div class="event-details-toggle">
                    <button class="details-btn" onclick="this.closest('.event-card').querySelector('.event-details-expanded').classList.toggle('expanded'); this.querySelector('i').classList.toggle('rotated');">
                        <i class="fa fa-chevron-down"></i> Ver detalles
                    </button>
                </div>
            </div>
            
            <!-- Expandable Details Section -->
            <div class="event-details-expanded">
                <div class="details-grid">
                    ${event.socialMediaPost ? `
                        <div class="detail-item">
                            <strong>Post Oficial:</strong>
                            <a href="${event.socialMediaPost}" target="_blank">
                                <i class="fab fa-instagram"></i> Ver post
                            </a>
                        </div>
                    ` : ''}
                    
                    ${event.registrationPage && event.registrationPage !== 'NA' ? `
                        <div class="detail-item">
                            <strong>Registro:</strong>
                            <a href="${event.registrationPage}" target="_blank">
                                <i class="fa fa-calendar-plus"></i> Registrarse
                            </a>
                        </div>
                    ` : ''}
                    
                    ${event.protocolToMint && event.protocolToMint !== 'NA' ? `
                        <div class="detail-item">
                            <strong>Protocolo de Mint:</strong>
                            <span>${event.protocolToMint}</span>
                        </div>
                    ` : ''}
                    
                    ${event.nftUrl && event.nftUrl !== 'NA' ? `
                        <div class="detail-item highlight">
                            <strong>NFT:</strong>
                            <a href="${event.nftUrl}" target="_blank">
                                <i class="fas fa-external-link-alt"></i> Ver NFT
                            </a>
                        </div>
                    ` : ''}
                    
                    ${event.chainNft && event.chainNft !== 'NA' ? `
                        <div class="detail-item">
                            <strong>Chain NFT:</strong>
                            <div class="chain-info">
                                <img src="${this.eventsService.getChainLogo(event.chainNft)}" 
                                     alt="${event.chainNft}" class="chain-logo">
                                <span>${event.chainNft}</span>
                                ${event.mintsNft ? `<span class="mint-count">(${event.mintsNft} mints)</span>` : ''}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${event.poapLink && event.poapLink !== 'NA' ? `
                        <div class="detail-item highlight">
                            <strong>POAP:</strong>
                            <a href="${event.poapLink}" target="_blank">
                                <i class="fa fa-gift"></i> Ver POAP
                            </a>
                            ${event.collectorsPOAP ? `<span class="collectors-count">(${event.collectorsPOAP} collectors)</span>` : ''}
                        </div>
                    ` : ''}
                    
                    ${event.chainPOAP && event.chainPOAP !== 'NA' ? `
                        <div class="detail-item highlight">
                            <strong>Chain POAP:</strong>
                            <div class="chain-info">
                                <img src="${this.eventsService.getChainLogo(event.chainPOAP)}" 
                                     alt="${event.chainPOAP}" class="chain-logo">
                                <span>${event.chainPOAP}</span>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${event.recapSocialMedia && event.recapSocialMedia !== 'NA' ? `
                        <div class="detail-item">
                            <strong>Recap:</strong>
                            <a href="${event.recapSocialMedia}" target="_blank">
                                <i class="fa fa-play-circle"></i> Ver recap
                            </a>
                        </div>
                    ` : ''}
                    
                    ${event.registroFotografico && event.registroFotografico !== 'NA' ? `
                        <div class="detail-item highlight">
                            <strong>Fotos:</strong>
                            <a href="${event.registroFotografico}" target="_blank">
                                <i class="fa fa-images"></i> Ver fotos
                            </a>
                        </div>
                    ` : ''}
                    
                    ${event.youtubeRecording && event.youtubeRecording !== 'NA' ? `
                        <div class="detail-item">
                            <strong>Grabación:</strong>
                            <a href="${event.youtubeRecording}" target="_blank">
                                <i class="fab fa-youtube"></i> Ver video
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="event-card-footer">
                ${event.registroFotografico && event.registroFotografico !== 'NA' ? `
                    <a href="${event.registroFotografico}" class="btn-discover" target="_blank">
                        <i class="fas fa-camera"></i> Registro Fotográfico
                    </a>
                ` : event.socialMediaPost ? `
                    <a href="${event.socialMediaPost}" class="btn-discover" target="_blank">Ver más</a>
                ` : '<span class="btn-discover disabled">Sin enlace</span>'}
            </div>
        `;
        
        return card;
    }

    renderInternationalMetrics(metrics, containerId = 'metrics-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-number">${metrics.totalEvents}</div>
                    <div class="metric-label">Total Events</div>
                </div>
                <div class="metric-card">
                    <div class="metric-number">${metrics.totalCountries}</div>
                    <div class="metric-label">Countries</div>
                </div>
                <div class="metric-card">
                    <div class="metric-number">2025</div>
                    <div class="metric-label">Year</div>
                </div>
            </div>
        `;
    }

    renderLocalMetrics(metrics, containerId = 'metrics-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const typeContentItems = Object.entries(metrics.typeContentCounts)
            .map(([type, count]) => `<span class="type-badge type-content">${type}: ${count}</span>`)
            .join('');

        const typeEventItems = Object.entries(metrics.typeEventCounts)
            .map(([type, count]) => `<span class="type-badge type-event">${type}: ${count}</span>`)
            .join('');

        const chainMintsItems = Object.entries(metrics.chainMints)
            .map(([chain, mints]) => `
                <div class="chain-mint-item">
                    <img src="${this.eventsService.getChainLogo(chain)}" alt="${chain}" class="chain-logo-small">
                    <span>${chain}: ${mints}</span>
                </div>
            `).join('');

        container.innerHTML = `
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-number">${metrics.totalEvents}</div>
                    <div class="metric-label">Total Events</div>
                </div>
                <div class="metric-card">
                    <div class="metric-number">${metrics.totalAttendees}</div>
                    <div class="metric-label">Total Attendees</div>
                </div>
                <div class="metric-card wide">
                    <div class="metric-label">Events by Content Type</div>
                    <div class="type-content-list">${typeContentItems}</div>
                </div>
                <div class="metric-card wide">
                    <div class="metric-label">Events by Type</div>
                    <div class="type-event-list">${typeEventItems}</div>
                </div>
                <div class="metric-card wide">
                    <div class="metric-label">NFT Mints by Chain</div>
                    <div class="chain-mints-list">${chainMintsItems}</div>
                </div>
            </div>
        `;
    }

    setupMonthFilter(events, renderFunction) {
        const monthBtns = document.querySelectorAll('.month-btn');
        
        monthBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                monthBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                this.applyFilters(events, renderFunction);
            });
        });
    }

    setupYearFilter(events, renderFunction) {
        const yearBtns = document.querySelectorAll('.year-btn');
        
        yearBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                yearBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                this.applyFilters(events, renderFunction);
            });
        });
    }

    applyFilters(events, renderFunction) {
        const activeYearBtn = document.querySelector('.year-btn.active');
        const activeMonthBtn = document.querySelector('.month-btn.active');
        
        const selectedYear = activeYearBtn ? activeYearBtn.getAttribute('data-year') : 'all';
        const selectedMonth = activeMonthBtn ? activeMonthBtn.getAttribute('data-month') : 'all';
        
        const filteredEvents = this.eventsService.filterEventsByYearAndMonth(events, selectedYear, selectedMonth);
        renderFunction(filteredEvents);
    }

    setupFilters(events, renderFunction) {
        this.setupMonthFilter(events, renderFunction);
        this.setupYearFilter(events, renderFunction);
    }

    formatDateRange(startDate, endDate) {
        if (startDate === endDate) return startDate;
        return `${startDate} - ${endDate}`;
    }

    ensureHttps(url) {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    }
}

// Export for use in other modules
window.EventsUI = EventsUI;