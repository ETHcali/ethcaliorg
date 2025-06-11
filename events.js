document.addEventListener('DOMContentLoaded', () => {
    const eventsContainer = document.getElementById('events-list');
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    let allEventsByMonth = {}; // Store all events data for filtering

    // Function to parse date string
    function parseDate(dateStr) {
        // Handle cases like "January 5", "February 16"
        const months = {
            'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
            'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
        };
        
        // Split the date string
        const parts = dateStr.split(' ');
        const monthIndex = months[parts[0]];
        const day = parseInt(parts[1]);
        
        // Use current year (2025)
        return new Date(2025, monthIndex, day);
    }

    // Function to create social media links
    function createSocialLinks(website, social, chat) {
        const links = [];
        
        // Website link
        if (website && website !== '-') {
            links.push(`
                <a href="${website.startsWith('http') ? website : 'https://' + website}" 
                   target="_blank" 
                   title="Sitio Web" 
                   class="event-link website">
                    <i class="fas fa-globe"></i>
                </a>
            `);
        }
        
        // Chat link
        if (chat && chat !== '-') {
            const chatLink = chat.startsWith('t.me') 
                ? `https://${chat}` 
                : chat.startsWith('http') 
                    ? chat 
                    : `https://${chat}`;
            
            links.push(`
                <a href="${chatLink}" 
                   target="_blank" 
                   title="Chat Comunidad" 
                   class="event-link chat">
                    <i class="fas fa-comments"></i>
                </a>
            `);
        }
        
        return links.join('');
    }

    // Function to get the primary event link for the Discover button
    function getPrimaryEventLink(website, social) {
        // Prioritize website, then social media
        if (website && website !== '-') {
            return website.startsWith('http') ? website : 'https://' + website;
        } else if (social && social !== '-') {
            return social.startsWith('http') ? social : `https://${social}`;
        }
        return null;
    }

    // Fetch the CSV file
    fetch('2025ethereumevents.csv')
        .then(response => response.text())
        .then(csvText => {
            // Split the CSV into lines
            const lines = csvText.split('\n');
            
            // Skip the header rows and last few empty rows
            const eventLines = lines.slice(7, -4);
            
            // Group events by month
            const eventsByMonth = {};
            
            // Parse events
            eventLines.forEach(line => {
                // Split the line by comma, handling potential CSV complexities
                const fields = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''));
                
                // Skip empty or invalid lines
                if (fields.length < 2 || !fields[1] || fields[1] === 'Event') return;

                // Parse the start date
                try {
                    const startDate = parseDate(fields[2]);
                    const monthKey = monthNames[startDate.getMonth()];
                    
                    // Create month array if it doesn't exist
                    if (!eventsByMonth[monthKey]) {
                        eventsByMonth[monthKey] = [];
                    }
                    
                    // Add event to the month
                    eventsByMonth[monthKey].push({
                        name: fields[1],
                        startDate: fields[2],
                        endDate: fields[3],
                        location: fields[4],
                        website: fields[5],
                        social: fields[6],
                        chat: fields[7]
                    });
                } catch (error) {
                    console.warn(`Could not parse date for event: ${fields[1]}`, error);
                }
            });

            // Store events data globally for filtering
            allEventsByMonth = eventsByMonth;

            // Sort months chronologically
            const sortedMonths = monthNames.filter(month => eventsByMonth[month]);

            // Render all events with month headers initially
            renderEvents(sortedMonths, eventsByMonth, true);
            
            // Setup month filtering
            setupMonthFiltering();
        })
        .catch(error => {
            console.error('Error loading events:', error);
            eventsContainer.innerHTML = `
                <div class="error-message">
                    <p>No se pudieron cargar los eventos. Por favor, intenta de nuevo más tarde.</p>
                </div>
            `;
        });

    // Function to render events with proper grid distribution
    function renderEvents(months, eventsByMonth, showMonthHeaders = true) {
        eventsContainer.innerHTML = ''; // Clear container
        
        // Collect all events with month info
        const allEvents = [];
        months.forEach(month => {
            const monthEvents = eventsByMonth[month].sort((a, b) => {
                const dateA = parseDate(a.startDate);
                const dateB = parseDate(b.startDate);
                return dateA - dateB;
            });
            
            monthEvents.forEach(event => {
                allEvents.push({ ...event, month });
            });
        });
        
        // Create main events grid
        const eventsGrid = document.createElement('div');
        eventsGrid.classList.add('events-grid');
        
        // If showing multiple months and headers are enabled, organize by month
        if (showMonthHeaders && months.length > 1) {
            months.forEach(month => {
                // Month header
                const monthHeader = document.createElement('div');
                monthHeader.classList.add('month-header');
                monthHeader.innerHTML = `<h2 class="month-title">${month.toUpperCase()}</h2>`;
                eventsGrid.appendChild(monthHeader);
                
                // Events for this month
                const monthEvents = allEvents.filter(event => event.month === month);
                monthEvents.forEach(event => {
                    eventsGrid.appendChild(createEventCard(event));
                });
            });
        } else {
            // Single month or all events mixed - just add all cards
            allEvents.forEach(event => {
                eventsGrid.appendChild(createEventCard(event));
            });
        }
        
        eventsContainer.appendChild(eventsGrid);
    }
    
    // Function to create a single event card
    function createEventCard(event) {
        const card = document.createElement('div');
        card.classList.add('event-card');
        
        // Parse the start date to get proper month
        const startDate = parseDate(event.startDate);
        card.setAttribute('data-month', startDate.getMonth());

        // Format date range
        let dateDisplay = event.startDate;
        if (event.endDate && event.endDate !== '-' && event.endDate !== event.startDate) {
            dateDisplay += ` - ${event.endDate}`;
        }

        // Get primary link for discover button
        const primaryLink = getPrimaryEventLink(event.website, event.social);
        
        // Create social links
        const socialLinks = createSocialLinks(event.website, event.social, event.chat);

        card.innerHTML = `
            <div class="event-card-header">
                <div class="event-card-title">
                    <h3>${event.name}</h3>
                    <button class="event-share-btn" onclick="shareEvent('${event.name}', '${event.location}', '${dateDisplay}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
                <div class="event-date">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${dateDisplay}</span>
                </div>
            </div>
            
            <div class="event-card-body">
                <div class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location || 'Ubicación por confirmar'}</span>
                </div>
                
                <div class="event-links">
                    ${socialLinks}
                </div>
            </div>
            
            <div class="event-card-footer">
                ${primaryLink ? `
                    <a href="${primaryLink}" target="_blank" class="btn-discover">
                        <span>Discover</span>
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                ` : `
                    <div class="btn-discover disabled">
                        <span>Coming Soon</span>
                        <i class="fas fa-clock"></i>
                    </div>
                `}
            </div>
        `;

        return card;
    }

    // Function to setup month filtering
    function setupMonthFiltering() {
        const monthButtons = document.querySelectorAll('.month-btn');
        
        monthButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all buttons
                monthButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                const selectedMonth = e.target.getAttribute('data-month');
                filterEventsByMonth(selectedMonth);
            });
        });
    }

    // Function to filter events by month
    function filterEventsByMonth(monthFilter) {
        if (monthFilter === 'all') {
            // Show all months with headers
            const sortedMonths = monthNames.filter(month => allEventsByMonth[month]);
            renderEvents(sortedMonths, allEventsByMonth, true);
        } else {
            // Show only selected month without headers (single month)
            const monthIndex = parseInt(monthFilter);
            const selectedMonthName = monthNames[monthIndex];
            
            if (allEventsByMonth[selectedMonthName]) {
                const filteredEvents = { [selectedMonthName]: allEventsByMonth[selectedMonthName] };
                renderEvents([selectedMonthName], filteredEvents, false);
            } else {
                eventsContainer.innerHTML = `
                    <div class="no-events-message">
                        <h3>No hay eventos en ${selectedMonthName}</h3>
                        <p>Selecciona otro mes para ver los eventos disponibles.</p>
                    </div>
                `;
            }
        }
    }
});

// Global function to share event details
function shareEvent(eventName, location, date) {
    if (navigator.share) {
        navigator.share({
            title: `${eventName} - Ethereum Cali`,
            text: `¡Únete a ${eventName} en ${location}! Fecha: ${date}`,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        const shareText = `${eventName}\nFecha: ${date}\nLugar: ${location}\n${window.location.href}`;
        navigator.clipboard.writeText(shareText).then(() => {
            // Show feedback
            const button = event.target.closest('.event-share-btn');
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                button.innerHTML = originalIcon;
            }, 2000);
        }).catch(console.error);
    }
}