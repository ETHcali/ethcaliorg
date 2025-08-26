/**
 * Events Service - Handles data processing for both international and local events
 */

class EventsService {
    constructor() {
        this.internationalEvents = [];
        this.localEvents = [];
        this.chainLogos = {
            'Base': 'chains/base logo.svg',
            'Polygon': 'chains/polygon.png', 
            'Gnosis': 'chains/gnosis.png',
            'Ethereum': 'chains/ethereum.png',
            'Optimism': 'chains/op mainnet.png'
        };
    }

    async loadInternationalEvents() {
        try {
            const response = await fetch('databases/2025ethereumevents.csv');
            const csvText = await response.text();
            this.internationalEvents = this.parseInternationalCSV(csvText);
            return this.internationalEvents;
        } catch (error) {
            console.error('Error loading international events:', error);
            return [];
        }
    }

    async loadLocalEvents() {
        try {
            const response = await fetch('databases/Eventos historicos ethcali - historic.csv');
            const csvText = await response.text();
            this.localEvents = this.parseLocalCSV(csvText);
            return this.localEvents;
        } catch (error) {
            console.error('Error loading local events:', error);
            return [];
        }
    }

    parseInternationalCSV(csvText) {
        const lines = csvText.split('\n');
        const events = [];
        
        // Find the header row (line with "Event,startDate,endDate...")
        let headerIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('Event,startDate,endDate')) {
                headerIndex = i;
                break;
            }
        }
        
        if (headerIndex === -1) return events;
        
        const headers = lines[headerIndex].split(',');
        
        for (let i = headerIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith(',,,,') || line.includes('Last update:') || line.includes('*not ethereum-specific')) continue;
            
            const values = this.parseCSVLine(line);
            if (values.length >= 6 && values[1]) { // Must have at least event name
                const event = {
                    name: values[1],
                    startDate: values[2],
                    endDate: values[3],
                    location: values[4],
                    link: values[5],
                    social: values[6],
                    chat: values[7],
                    month: this.getMonthFromDate(values[2]),
                    country: this.extractCountry(values[4])
                };
                events.push(event);
            }
        }
        
        return events;
    }

    parseLocalCSV(csvText) {
        const lines = csvText.split('\n');
        const events = [];
        
        if (lines.length < 2) return events;
        
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = this.parseCSVLine(line);
            if (values.length >= 20 && values[0] && values[1]) { // Must have date and name
                const event = {
                    date: values[0],
                    name: values[1],
                    typeContent: values[2],
                    typeEvent: values[3],
                    hostColab: values[4],
                    location: values[5],
                    socialMediaPost: values[6],
                    registrationPage: values[7],
                    rsvp: values[8],
                    protocolToMint: values[9],
                    nftUrl: values[10],
                    chainNft: values[11],
                    mintsNft: values[12],
                    poapLink: values[13],
                    collectorsPOAP: values[14],
                    chainPOAP: values[15],
                    recapSocialMedia: values[16],
                    registroFotografico: values[17],
                    carpetaDelEvento: values[18],
                    youtubeRecording: values[19],
                    month: this.getMonthFromDate(values[0]),
                    image: this.findEventImage(values[0], values[1])
                };
                events.push(event);
            }
        }
        
        return events;
    }

    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current.trim());
        return values;
    }

    getMonthFromDate(dateStr) {
        if (!dateStr) return -1;
        
        // Handle different date formats
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length >= 2) {
                return parseInt(parts[1]) - 1; // Month is 0-based
            }
        } else if (dateStr.includes(' ')) {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'];
            const parts = dateStr.split(' ');
            const monthName = parts[0];
            return monthNames.findIndex(m => m.toLowerCase().startsWith(monthName.toLowerCase()));
        }
        
        return -1;
    }

    extractCountry(location) {
        if (!location) return '';
        const parts = location.split(',');
        return parts[parts.length - 1].trim();
    }

    findEventImage(date, name) {
        if (!date || !name) return 'branding/logoethcali.png';
        
        // Convert date format and try to match with image names
        const dateFormatted = this.formatDateForImage(date);
        const nameFormatted = this.formatNameForImage(name);
        
        // Return a likely image path - in a real implementation, you'd check if file exists
        return `events/${dateFormatted} ${nameFormatted}.png`;
    }

    formatDateForImage(date) {
        if (!date) return '';
        
        if (date.includes('/')) {
            const parts = date.split('/');
            if (parts.length >= 3) {
                const day = parts[0].padStart(2, '0');
                const month = parts[1].padStart(2, '0');
                const year = parts[2];
                return `${year} ${month} ${day}`;
            }
        }
        
        return date;
    }

    formatNameForImage(name) {
        return name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    }

    filterEventsByMonth(events, month) {
        if (month === 'all') return events;
        return events.filter(event => event.month === parseInt(month));
    }

    getInternationalMetrics(events) {
        const totalEvents = events.length;
        const countries = [...new Set(events.map(e => e.country))].filter(c => c);
        const totalCountries = countries.length;
        
        return {
            totalEvents,
            totalCountries,
            countries
        };
    }

    getLocalMetrics(events) {
        const totalEvents = events.length;
        const typeContentCounts = {};
        const chainMints = {};
        const totalAttendees = events.reduce((sum, event) => {
            const rsvp = parseInt(event.rsvp) || 0;
            return sum + rsvp;
        }, 0);
        
        events.forEach(event => {
            // Count by type content
            if (event.typeContent) {
                typeContentCounts[event.typeContent] = (typeContentCounts[event.typeContent] || 0) + 1;
            }
            
            // Count mints by chain
            if (event.chainNft && event.mintsNft) {
                const mints = parseInt(event.mintsNft) || 0;
                chainMints[event.chainNft] = (chainMints[event.chainNft] || 0) + mints;
            }
        });
        
        return {
            totalEvents,
            typeContentCounts,
            chainMints,
            totalAttendees
        };
    }

    getChainLogo(chainName) {
        return this.chainLogos[chainName] || 'chains/ethereum.png';
    }
}

// Export for use in other modules
window.EventsService = EventsService;