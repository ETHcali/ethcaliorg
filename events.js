document.addEventListener('DOMContentLoaded', () => {
    console.log('Events page loaded');
    
    const eventsContainer = document.getElementById('events-list');
    
    if (!eventsContainer) {
        console.error('Events container not found');
        return;
    }

    // Load events from CSV
    function loadEventsFromCSV() {
        fetch('2025ethereumevents.csv')
            .then(response => response.text())
            .then(csvText => {
                console.log('CSV loaded successfully');
                const events = parseCSV(csvText);
                console.log(`Parsed ${events.length} events`);
                displayEvents(events);
                setupMonthFilters(events);
            })
            .catch(error => {
                console.error('Error loading CSV:', error);
                showError('Could not load events data');
            });
    }

    // Parse CSV data with correct field mapping
    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const events = [];
        
        // Find header line
        let headerIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('Event,startDate,endDate')) {
                headerIndex = i;
                break;
            }
        }
        
        if (headerIndex === -1) {
            console.error('Header not found');
            return events;
        }
        
        console.log('Found header at line:', headerIndex + 1);
        
        // Parse events
        for (let i = headerIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines and non-event lines
            if (!line || line === ',,,,,,,' || line.startsWith('Last update') || line.startsWith('*not ethereum')) {
                continue;
            }
            
            // Parse CSV line (handle quoted fields properly)
            const fields = parseCSVLine(line);
            
            // Skip if not enough fields or no event name
            // CSV structure: [empty], Event, startDate, endDate, Geo, Link, Social, Chat
            if (fields.length < 8 || !fields[1] || fields[1].trim() === '' || fields[1] === 'Event') {
                continue;
            }
            
            const event = {
                name: cleanField(fields[1]),
                startDate: cleanField(fields[2]),
                endDate: cleanField(fields[3]),
                geo: cleanField(fields[4]), // Complete geo info like "Lisbon, POR"
                link: cleanField(fields[5]), // Main website link for Discover button
                social: cleanField(fields[6]),
                chat: cleanField(fields[7])
            };
            
            // Only add if has a valid name
            if (event.name && event.name !== 'TBD' && event.name !== 'Event') {
                events.push(event);
                console.log(`Added event: ${event.name} in ${event.geo}`);
            }
        }
        
        return events;
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

    // Display all events with optional filter
    function displayEvents(events, month = 'all') {
        eventsContainer.innerHTML = '';
        let filtered = events;
        if (month !== 'all') {
            filtered = events.filter(ev => {
                if (!ev.startDate) return false;
                const date = new Date(ev.startDate);
                return date.getMonth() === parseInt(month);
            });
        }
        if (filtered.length === 0) {
            showError('No events found');
            return;
        }
        const grid = document.createElement('div');
        grid.className = 'events-grid';
        filtered.forEach(event => {
            const card = createEventCard(event);
            grid.appendChild(card);
        });
        eventsContainer.appendChild(grid);
        console.log(`Displayed ${filtered.length} events`);
    }

    // Lógica de filtrado por mes
    function setupMonthFilters(events) {
        const filterBtns = document.querySelectorAll('.month-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const month = btn.getAttribute('data-month');
                displayEvents(events, month);
            });
        });
    }

    // Create individual event card
    function createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card';
        
        // Format date
        let dateDisplay = event.startDate || 'TBD';
        if (event.endDate && event.endDate !== '-' && event.endDate !== event.startDate) {
            dateDisplay += ` - ${event.endDate}`;
        }
        
        // Clean and prepare links
        const mainLink = cleanLink(event.link); // Main link for Discover button
        const socialLink = cleanSocialLink(event.social);
        const chatLink = cleanChatLink(event.chat);
        
        // Use complete geo information
        const location = event.geo || 'Location TBD';
        
        card.innerHTML = `
            <div class="event-card-header">
                <h3>${event.name}</h3>
                <div class="event-date">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${dateDisplay}</span>
                </div>
            </div>
            
            <div class="event-card-body">
                <div class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${location}</span>
                </div>
            </div>
            
            <div class="event-card-footer">
                <div class="event-links">
                    ${mainLink ? `<a href="${mainLink}" target="_blank" class="event-link website" title="Website"><i class="fas fa-globe"></i></a>` : ''}
                    ${socialLink ? `<a href="${socialLink}" target="_blank" class="event-link twitter" title="Social"><i class="fab fa-twitter"></i></a>` : ''}
                    ${chatLink ? `<a href="${chatLink}" target="_blank" class="event-link chat" title="Chat"><i class="fas fa-comments"></i></a>` : ''}
                </div>
                ${mainLink ? `
                    <a href="${mainLink}" target="_blank" class="btn-discover">
                        <span>Discover</span>
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                ` : `
                    <div class="btn-discover" style="background: #666; cursor: not-allowed;">
                        <span>Coming Soon</span>
                        <i class="fas fa-clock"></i>
                    </div>
                `}
            </div>
        `;
        
        return card;
    }

    // Clean main website link (for Discover button)
    function cleanLink(link) {
        if (!link || link === '-' || link.trim() === '') return null;
        link = link.trim();
        return link.startsWith('http') ? link : `https://${link}`;
    }

    // Clean social link
    function cleanSocialLink(social) {
        if (!social || social === '-' || social.trim() === '') return null;
        social = social.trim();
        if (social.startsWith('http')) return social;
        if (social.startsWith('warpcast.com')) return `https://${social}`;
        return `https://x.com/${social.replace('@', '')}`;
    }

    // Clean chat link
    function cleanChatLink(chat) {
        if (!chat || chat === '-' || chat.trim() === '') return null;
        chat = chat.trim();
        if (chat.startsWith('http')) return chat;
        if (chat.includes('t.me') || chat.includes('telegram')) {
            return chat.startsWith('t.me') ? `https://${chat}` : `https://t.me/${chat}`;
        }
        if (chat.includes('discord')) {
            return chat.startsWith('discord') ? `https://${chat}` : `https://discord.gg/${chat}`;
        }
        return `https://${chat}`;
    }

    // Show error message
    function showError(message) {
        eventsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ccc;">
                <h3>⚠️ ${message}</h3>
                <p>Please try again later</p>
            </div>
        `;
    }

    // Start loading events
    loadEventsFromCSV();
});