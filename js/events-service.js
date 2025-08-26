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
                    year: this.getYearFromDate(values[0]),
                    image: this.findEventImagePrecise(values[0], values[1]),
                    locationName: this.extractLocationName(values[5]),
                    locationUrl: this.extractLocationUrl(values[5])
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

    getYearFromDate(dateStr) {
        if (!dateStr) return null;
        
        // Handle different date formats
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length >= 3) {
                return parseInt(parts[2]);
            }
        } else if (dateStr.includes(' ')) {
            const parts = dateStr.split(' ');
            for (const part of parts) {
                const year = parseInt(part);
                if (year >= 2020 && year <= 2030) {
                    return year;
                }
            }
        }
        
        return null;
    }

    extractCountry(location) {
        if (!location) return '';
        const parts = location.split(',');
        return parts[parts.length - 1].trim();
    }

    extractLocationName(locationString) {
        if (!locationString) return 'Ubicación no especificada';
        
        // Pattern: "Name: https://url" or just "Name"
        if (locationString.includes(':')) {
            const name = locationString.split(':')[0].trim();
            return name || 'Ubicación no especificada';
        }
        
        return locationString.trim();
    }

    extractLocationUrl(locationString) {
        if (!locationString) return '';
        
        // Pattern: "Name: https://url"
        if (locationString.includes('https://')) {
            const urlMatch = locationString.match(/https:\/\/[^\s,]+/);
            return urlMatch ? urlMatch[0] : '';
        }
        
        return '';
    }

    findEventImage(date, name) {
        if (!date || !name) return 'branding/logoethcali.png';
        
        // Convert date format and try to match with image names
        const dateFormatted = this.formatDateForImage(date);
        const nameFormatted = this.formatNameForImage(name);
        
        // Return a likely image path - in a real implementation, you'd check if file exists
        return `events/${dateFormatted} ${nameFormatted}.png`;
    }

    findEventImagePrecise(date, name) {
        if (!date || !name) return 'branding/logoethcali.png';
        
        // List of actual images from the events folder
        const availableImages = [
            '2025 08 11 ETHEREUM NYC next fin summit.avif',
            '2025 07 28 Uniswap On the Ground.png',
            '2025 08 09 Destino Devconnect - La Sucursal del Cielo + Ethereum Birthday 2025 10Y.jpg',
            '2025 06 13 Hackathon WEB3 Cali.png',
            '2025 07 19 Hackathon USC.png',
            '2025 06 08 Papayogin.png',
            '2025 05 22 Global Pizza Party 2025.png',
            '2025 05 17 Open House USB.png',
            '2025 05 09 Hacksession Base Batch LATAM_ Zonamerica Colombia.png',
            '2025 05 09 Base Community Meetup #3_ Build Digital Portfolios with DeFi & Ethereum.png',
            '2024 11 14 Devcon VII Thailandia.png',
            '2024 11 12 Base Community Meetup #2_ Onchain Education with ICESI.png',
            '2024 07 28 BASE Community Meetup #1 + Ethereum Birthday 2024.png',
            '2024 09 20 Financiando tus bienes publicos con Giveth.png',
            '2024 06 21 Drumcode Cali.jpeg',
            '2024 05 25 Road to Drumcode Pizza Party.png',
            '2024 05 22 Road to Drumcode_ Global Pizza Party 2024.png',
            '2024 05 25  Road to Drumcode_ Discoteca 1060.png',
            '2024 03 24 QF ETHColombia Meetup Cali.png',
            '2023 12 16 Proof-of-Stake en Ramada Cafe.png',
            '2023 11 27 Hackathon WEB3 Ethcolombia.png',
            '2023 11 18 Taller Programacion Solidity.png',
            '2023 11 04 Ramada Cafe Opening.png',
            '2023 11 03 Data Day UAO.png',
            '2023 10 7 ETHColombia Day.png',
            '2023 10 23 Pyday Cali.png',
            '2023 10 04 BSL 2023 Voluntariado.png',
            '2023 08 24 a 10 23 Ethereum Starter Pack .png',
            '2023 08 19 Setup EVM Universidad Libre.png',
            '2023 08 16 Ethereum Birthday 2023 - Empresarios Web3  .png',
            '2023 05 19 workshop digital art.png',
            '2023 05 22 Global Pizza Party 2023.png',
            '2023 07 27 Hashfest.png',
            '2023 04 29 Ethereans del Pacifico 2 1000x1000.png',
            '2023 03 11 Ethereum at the River.png',
            '2023 03 01 Revolucion de la Contabilidad.png',
            '2023 03 01 Reinvencion del Contador.png',
            '2023 02 23 Ethereans del Pacifico.png',
            '2022 11 14 Devcon VI.png'
        ];
        
        // Format the date from the data (DD/MM/YYYY to YYYY MM DD)
        const dateFormatted = this.formatDateForImagePrecise(date);
        
        // Try to find an exact match or closest match by date and name similarity
        for (const image of availableImages) {
            if (image.startsWith(dateFormatted)) {
                const imageName = image.replace(dateFormatted, '').toLowerCase();
                const eventName = name.toLowerCase();
                
                // Check for key words in the event name
                const keyWords = eventName.split(' ').filter(word => word.length > 3);
                const matchingWords = keyWords.filter(word => imageName.includes(word));
                
                if (matchingWords.length > 0) {
                    return `events/${image}`;
                }
            }
        }
        
        // Try to find by event name keywords only
        for (const image of availableImages) {
            const imageName = image.toLowerCase();
            const eventName = name.toLowerCase();
            
            if (eventName.includes('devcon') && imageName.includes('devcon')) return `events/${image}`;
            if (eventName.includes('pizza') && imageName.includes('pizza')) return `events/${image}`;
            if (eventName.includes('hackathon') && imageName.includes('hackathon')) return `events/${image}`;
            if (eventName.includes('base') && imageName.includes('base')) return `events/${image}`;
            if (eventName.includes('birthday') && imageName.includes('birthday')) return `events/${image}`;
            if (eventName.includes('drumcode') && imageName.includes('drumcode')) return `events/${image}`;
            if (eventName.includes('ethereum') && imageName.includes('ethereum')) return `events/${image}`;
        }
        
        // Fallback to default image
        return 'branding/logoethcali.png';
    }

    formatDateForImagePrecise(date) {
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

    filterEventsByYear(events, year) {
        if (year === 'all') return events;
        return events.filter(event => event.year === parseInt(year));
    }

    filterEventsByYearAndMonth(events, year, month) {
        let filtered = events;
        
        if (year !== 'all') {
            filtered = this.filterEventsByYear(filtered, year);
        }
        
        if (month !== 'all') {
            filtered = this.filterEventsByMonth(filtered, month);
        }
        
        return filtered;
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
        const typeEventCounts = {};
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
            
            // Count by type event
            if (event.typeEvent) {
                typeEventCounts[event.typeEvent] = (typeEventCounts[event.typeEvent] || 0) + 1;
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
            typeEventCounts,
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