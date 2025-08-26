document.addEventListener('DOMContentLoaded', () => {
    const venuesContainer = document.getElementById('venues-container');
    if (!venuesContainer) {
        console.error('Venues container not found');
        return;
    }
    let allVenues = [];

    function loadVenuesFromCSV() {
        fetch('databases/venuesethcali.csv')
            .then(response => response.text())
            .then(csvText => {
                const venues = parseCSV(csvText);
                allVenues = venues;
                displayVenues(venues);
                displayStats(venues);
                setupFilters();
            })
            .catch(error => {
                console.error('Error loading CSV:', error);
                showError('Could not load venues data');
            });
    }

    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const venues = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const fields = parseCSVLine(line);
            if (fields.length >= 4 && fields[0] && fields[0].trim() !== '') {
                const venue = {
                    name: cleanField(fields[0]),
                    type: cleanField(fields[1]),
                    status: cleanField(fields[2]),
                    activities: cleanField(fields[3]) || '0',
                    url: cleanField(fields[4]) || ''
                };
                if (venue.name && venue.name !== 'Name') {
                    venues.push(venue);
                }
            }
        }
        return venues;
    }

    function parseCSVLine(line) {
        const fields = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                fields.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        fields.push(current);
        return fields;
    }

    function cleanField(field) {
        if (!field) return '';
        return field.trim().replace(/^"|"$/g, '');
    }

    function displayVenues(venues) {
        venuesContainer.innerHTML = '';
        if (venues.length === 0) {
            showError('No venues found');
            return;
        }
        venues.forEach(venue => {
            const card = createVenueCard(venue);
            venuesContainer.appendChild(card);
        });
        updateVenueStats(venues);
    }

    function updateVenueStats(venues) {
        const stats = calculateVenueStats(venues);
        const statsContainer = document.getElementById('venue-stats');
        if (statsContainer) {
            statsContainer.innerHTML = createStatsHTML(stats);
            setupStatCardFiltering();
        }
    }

    function setupStatCardFiltering() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const filterBtns = document.querySelectorAll('.filter-btn');
                filterBtns.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-filter') === (type || 'all')) {
                        btn.classList.add('active');
                    }
                });
                filterVenues(type || 'all');
            });
        });
    }

    function calculateVenueStats(venues) {
        const typeStats = {};
        let totalVenues = venues.length;
        venues.forEach(venue => {
            const type = venue.type;
            if (typeStats[type]) {
                typeStats[type]++;
            } else {
                typeStats[type] = 1;
            }
        });
        return {
            total: totalVenues,
            byType: typeStats
        };
    }

    function createStatsHTML(stats) {
        let html = `
            <div class="stats-grid">
                <div class="stat-card total-stat">
                    <div class="stat-icon">🏟️</div>
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">Total Venues</div>
                </div>
        `;
        Object.entries(stats.byType).forEach(([type, count]) => {
            const icon = getVenueIcon(type);
            html += `
                <div class="stat-card type-stat" data-type="${formatTypeForFilter(type)}">
                    <div class="stat-icon">${icon}</div>
                    <div class="stat-number">${count}</div>
                    <div class="stat-label">${type}</div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }

    function createVenueCard(venue) {
        const card = document.createElement('div');
        card.className = 'venue-card';
        card.setAttribute('data-type', formatTypeForFilter(venue.type));
        const icon = getVenueIcon(venue.type);
        const typeClass = formatTypeForClass(venue.type);
        const statusClass = formatStatusForClass(venue.status);
        const statusDisplay = venue.status.toUpperCase();
        const activitiesCount = venue.activities || '0';
        const activitiesText = activitiesCount === '1' ? 'Actividad' : 'Actividades';
        card.innerHTML = `
            <div class="venue-header">
                <h3 class="venue-name">
                    <span class="venue-icon">${icon}</span>
                    ${venue.name}
                </h3>
                <span class="venue-type ${typeClass}">${venue.type}</span>
                <div class="venue-status ${statusClass}">
                    <div class="status-dot"></div>
                    <span>${statusDisplay}</span>
                </div>
            </div>
            <div class="venue-body">
                <div class="venue-stats">
                    <div class="activities-count">
                        <i class="fas fa-calendar"></i>
                        <span>${activitiesCount} ${activitiesText}</span>
                    </div>
                    ${venue.url ? `
                        <a href="${venue.url}" class="venue-link" target="_blank">
                            <i class="fas fa-map-marker-alt"></i>
                            Ver Ubicación
                        </a>
                    ` : `
                        <span class="venue-link" style="color: #666; cursor: not-allowed;">
                            <i class="fas fa-map-marker-alt"></i>
                            Sin ubicación
                        </span>
                    `}
                </div>
            </div>
        `;
        return card;
    }

    function getVenueIcon(type) {
        const iconMap = {
            'GastroBar': '🍹',
            'Club Music': '💿',
            'Coworking': '👨🏼‍💻',
            'University': '🎓',
            'Restaurant': '🍽️',
            'Office Partner': '🏢',
            'Bar Open Air': '🍺'
        };
        return iconMap[type] || '🏢';
    }

    function formatTypeForClass(type) {
        const classMap = {
            'GastroBar': 'gastrobar',
            'Club Music': 'club-music',
            'Coworking': 'coworking',
            'University': 'university',
            'Restaurant': 'restaurant',
            'Office Partner': 'office-partner',
            'Bar Open Air': 'bar-open-air'
        };
        return classMap[type] || 'other';
    }

    function formatTypeForFilter(type) {
        return formatTypeForClass(type);
    }

    function formatStatusForClass(status) {
        const statusMap = {
            'ACTIVATED': 'status-activated',
            'OPENING': 'status-opening',
            'TO TALK': 'status-to-talk'
        };
        return statusMap[status] || 'status-to-talk';
    }

    function setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filter = this.getAttribute('data-filter');
                filterVenues(filter);
            });
        });
    }

    function filterVenues(filter) {
        const venueCards = document.querySelectorAll('.venue-card');
        venueCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-type') === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function displayStats(venues) {
        const statsContainer = document.getElementById('venue-stats');
        if (!statsContainer) return;

        // Calculate statistics
        const totalVenues = venues.length;
        const activatedVenues = venues.filter(v => v.status === 'ACTIVATED').length;
        const totalActivities = venues.reduce((sum, v) => sum + parseInt(v.activities || 0), 0);
        
        // Count by type
        const typeStats = {};
        venues.forEach(venue => {
            const type = venue.type || 'other';
            typeStats[type] = (typeStats[type] || 0) + 1;
        });

        // Count by status
        const statusStats = {};
        venues.forEach(venue => {
            const status = venue.status || 'unknown';
            statusStats[status] = (statusStats[status] || 0) + 1;
        });

        const statsHTML = `
            <div class="stats-grid">
                <div class="stat-card total-stat">
                    <i class="stat-icon fas fa-building"></i>
                    <div class="stat-number">${totalVenues}</div>
                    <div class="stat-label">Total Venues</div>
                </div>
                <div class="stat-card">
                    <i class="stat-icon fas fa-check-circle" style="color: #00ff88;"></i>
                    <div class="stat-number">${activatedVenues}</div>
                    <div class="stat-label">Activated</div>
                </div>
                <div class="stat-card">
                    <i class="stat-icon fas fa-calendar-alt" style="color: #62688F;"></i>
                    <div class="stat-number">${totalActivities}</div>
                    <div class="stat-label">Total Activities</div>
                </div>
                <div class="stat-card">
                    <i class="stat-icon fas fa-chart-pie" style="color: #5A6FBF;"></i>
                    <div class="stat-number">${Object.keys(typeStats).length}</div>
                    <div class="stat-label">Venue Types</div>
                </div>
            </div>
        `;

        statsContainer.innerHTML = statsHTML;
    }

    function showError(message) {
        venuesContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ccc;">
                <h3>⚠️ ${message}</h3>
                <p>Please try again later</p>
            </div>
        `;
    }

    loadVenuesFromCSV();
});