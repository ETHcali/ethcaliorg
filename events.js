document.addEventListener('DOMContentLoaded', () => {
    const eventsGrid = document.getElementById('events-list');
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

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

    // Function to format date
    function formatDate(dateStr) {
        try {
            const date = parseDate(dateStr);
            return `${date.getDate()} ${monthNames[date.getMonth()]}`;
        } catch {
            return dateStr;
        }
    }

    // Function to create social media links
    function createSocialLinks(social, chat) {
        const links = [];
        
        // Website link
        if (social) {
            links.push(`
                <a href="${social.startsWith('http') ? social : 'https://' + social}" 
                   target="_blank" 
                   title="Sitio Web" 
                   class="event-link website">
                    <i class="fas fa-globe"></i>
                </a>
            `);
        }
        
        // Social media link
        if (social && social.includes('twitter.com')) {
            links.push(`
                <a href="${social}" 
                   target="_blank" 
                   title="Twitter" 
                   class="event-link twitter">
                    <i class="fab fa-twitter"></i>
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

    // Fetch the CSV file
    fetch('2025ethereumevents.csv')
        .then(response => response.text())
        .then(csvText => {
            // Split the CSV into lines
            const lines = csvText.split('\n');
            
            // Skip the header rows and last few empty rows
            const eventLines = lines.slice(7, -4);
            
            // Sort events by date
            const sortedEvents = eventLines
                .map(line => {
                    // Split the line by comma, handling potential CSV complexities
                    const fields = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''));
                    
                    // Skip empty or invalid lines
                    if (fields.length < 2 || !fields[1] || fields[1] === 'Event') return null;

                    return {
                        name: fields[1],
                        startDate: fields[2],
                        endDate: fields[3],
                        location: fields[4],
                        website: fields[5],
                        social: fields[6],
                        chat: fields[7]
                    };
                })
                .filter(event => event !== null)
                .sort((a, b) => {
                    try {
                        const dateA = parseDate(a.startDate);
                        const dateB = parseDate(b.startDate);
                        return dateA - dateB;
                    } catch {
                        return 0;
                    }
                });
            
            // Create event cards
            sortedEvents.forEach(event => {
                // Create event card
                const eventCard = document.createElement('div');
                eventCard.classList.add('event-card');
                
                // Determine date display
                const dateDisplay = event.startDate === event.endDate 
                    ? formatDate(event.startDate)
                    : `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`;
                
                // Construct event card HTML
                eventCard.innerHTML = `
                    <div class="event-card-header">
                        <h2>${event.name}</h2>
                        <div class="event-date">
                            <i class="fas fa-calendar-alt"></i> ${dateDisplay}
                        </div>
                    </div>
                    <div class="event-card-body">
                        <div class="event-location">
                            <i class="fas fa-map-marker-alt"></i> ${event.location}
                        </div>
                        <div class="event-links">
                            ${createSocialLinks(event.website, event.social, event.chat)}
                        </div>
                    </div>
                `;
                
                // Add to grid
                eventsGrid.appendChild(eventCard);
            });
        })
        .catch(error => {
            console.error('Error loading events:', error);
            eventsGrid.innerHTML = `
                <div class="error-message">
                    <p>No se pudieron cargar los eventos. Por favor, intenta de nuevo más tarde.</p>
                </div>
            `;
        });
}); 