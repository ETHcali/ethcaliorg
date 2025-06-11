document.addEventListener('DOMContentLoaded', () => {
    console.log('Venues page loaded');
    
    const venuesContainer = document.getElementById('venues-container');
    
    if (!venuesContainer) {
        console.error('Venues container not found');
        return;
    }

    let allVenues = []; // Store all venues for filtering

    // Load venues from CSV
    function loadVenuesFromCSV() {
        fetch('venuesethcali.csv')
            .then(response => response.text())
            .then(csvText => {
                console.log('CSV loaded successfully');
                const venues = parseCSV(csvText);
                console.log(`Parsed ${venues.length} venues`);
                allVenues = venues;
                displayVenues(venues);
                setupFilters();
            })
            .catch(error => {
                console.error('Error loading CSV:', error);
                showError('Could not load venues data');
            });
    }

    // Parse CSV data
    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const venues = [];
        
        // Skip header line (line 0)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines
            if (!line) continue;
            
            // Parse CSV line (handle quoted fields properly)
            const fields = parseCSVLine(line);
            
            // CSV structure: Name, TYPE, Status, ACTIVIDADES, URL
            if (fields.length >= 4 && fields[0] && fields[0].trim() !== '') {
                const venue = {
                    name: cleanField(fields[0]),
                    type: cleanField(fields[1]),
                    status: cleanField(fields[2]),
                    activities: cleanField(fields[3]) || '0',
                    url: cleanField(fields[4]) || ''
                };
                
                // Only add if has a valid name
                if (venue.name && venue.name !== 'Name') {
                    venues.push(venue);
                    console.log(`Added venue: ${venue.name} (${venue.type})`);
                }
            }
        }
        
        return venues;
    }

    // Parse a single CSV line handling quoted fields
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
        fields.push(current); // Add the last field
        
        return fields;
    }

    // Clean field data
    function cleanField(field) {
        if (!field) return '';
        return field.trim().replace(/^"|"$/g, ''); // Remove quotes and trim
    }

    // Display all venues
    function displayVenues(venues) {
        venuesContainer.innerHTML = ''; // Clear existing content
        
        if (venues.length === 0) {
            showError('No venues found');
            return;
        }
        
        venues.forEach(venue => {
            const card = createVenueCard(venue);
            venuesContainer.appendChild(card);
        });
        
        // Update statistics
        updateVenueStats(venues);
        
        console.log(`Displayed ${venues.length} venues`);
    }

    // Update venue statistics
    function updateVenueStats(venues) {
        // Calculate statistics
        const stats = calculateVenueStats(venues);
        
        // Update stats display
        const statsContainer = document.getElementById('venue-stats');
        if (statsContainer) {
            statsContainer.innerHTML = createStatsHTML(stats);
            setupStatCardFiltering();
        }
    }

    // Setup stat card filtering functionality
    function setupStatCardFiltering() {
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach(card => {
            card.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const filterBtns = document.querySelectorAll('.filter-btn');
                
                // Update filter buttons
                filterBtns.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-filter') === (type || 'all')) {
                        btn.classList.add('active');
                    }
                });
                
                // Filter venues
                filterVenues(type || 'all');
            });
        });
    }

    // Calculate venue statistics
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

    // Create statistics HTML
    function createStatsHTML(stats) {
        let html = `
            <div class="stats-grid">
                <div class="stat-card total-stat">
                    <div class="stat-icon">🏟️</div>
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">Total Venues</div>
                </div>
        `;
        
        // Add type statistics
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

    // Create individual venue card
    function createVenueCard(venue) {
        const card = document.createElement('div');
        card.className = 'venue-card';
        card.setAttribute('data-type', formatTypeForFilter(venue.type));
        
        // Get venue icon based on type
        const icon = getVenueIcon(venue.type);
        
        // Format type for CSS class
        const typeClass = formatTypeForClass(venue.type);
        
        // Format status for CSS class and display
        const statusClass = formatStatusForClass(venue.status);
        const statusDisplay = venue.status.toUpperCase();
        
        // Format activities count
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

    // Get icon based on venue type
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

    // Format type for CSS class
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

    // Format type for filter attribute
    function formatTypeForFilter(type) {
        return formatTypeForClass(type);
    }

    // Format status for CSS class
    function formatStatusForClass(status) {
        const statusMap = {
            'ACTIVATED': 'status-activated',
            'OPENING': 'status-opening',
            'TO TALK': 'status-to-talk'
        };
        return statusMap[status] || 'status-to-talk';
    }

    // Setup filter functionality
    function setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');
                filterVenues(filter);
            });
        });
    }

    // Filter venues
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

    // Show error message
    function showError(message) {
        venuesContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ccc;">
                <h3>⚠️ ${message}</h3>
                <p>Please try again later</p>
            </div>
        `;
    }

    // Start loading venues
    loadVenuesFromCSV();
}); 