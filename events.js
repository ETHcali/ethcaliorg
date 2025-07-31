document.addEventListener('DOMContentLoaded', () => {
    const eventsContainer = document.getElementById('events-list');
    if (!eventsContainer) {
        console.error('Events container not found');
        return;
    }

    // Load events from CSV
    function loadEventsFromCSV() {
        fetch('eventos_ethcali.csv')
            .then(response => response.text())
            .then(csvText => {
                const events = parseCSV(csvText);
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
        if (lines.length < 2) return [];
        const header = lines[0].split(',');
        const events = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith('Last update') || line.startsWith('*not ethereum')) continue;
            const fields = parseCSVLine(line);
            // Map fields by header
            const event = {};
            for (let j = 0; j < header.length; j++) {
                event[header[j].trim()] = cleanField(fields[j] || '');
            }
            // Adapt to card structure
            events.push({
                name: event['Name'],
                startDate: event['Date'],
                endDate: '',
                geo: event['Location'],
                link: event['instagram post'] || event['registration'] || event['RVSP'] || '',
                social: event['Recap Social Media'] || '',
                chat: event['Protocol to mint'] || '',
                // Puedes agregar más campos si quieres mostrarlos en la card
            });
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

    // Lista EXCLUSIVA de imágenes permitidas para las cards
    const eventImages = [
        'branding/events/Screenshot from 2025-07-30 02-44-45.png',
        'branding/events/Screenshot from 2025-07-30 03-03-56.png',
        'branding/events/Screenshot from 2025-07-30 03-08-37.png',
        'branding/events/Screenshot from 2025-07-30 03-09-14.png',
        'branding/events/Screenshot from 2025-07-30 03-09-55.png',
        'branding/events/Screenshot from 2025-07-30 03-10-30.png',
        'branding/events/Screenshot from 2025-07-30 03-28-04.png'
    ];
    let imageIndex = 0;

    // Create individual event card
    function createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card';

        // Seleccionar imagen de la lista, ciclando si es necesario
        const imageName = eventImages[imageIndex % eventImages.length];
        imageIndex++;
        let imgTag = `<img src="${imageName}" alt="${event.name}" class="event-image">`;

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
            ${imgTag}
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
            return chat.startsWith('discord') ? `https://${chat}` : `https://discord.gg/${chat}`
        }
        return null;
    }

    // Start loading events
    loadEventsFromCSV();
});