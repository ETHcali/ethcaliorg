/**
 * Events Service - Handles data processing for both international and local events
 */

class EventsService {
    constructor() {
        this.internationalEvents = [];
        this.posters = null;
        this.lumaIds = {};
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
            const [response] = await Promise.all([
                fetch('databases/Eventos historicos ethcali - historic.csv'),
                this.loadPosterManifest(),
                this.loadLumaIds(),
            ]);
            const csvText = await response.text();
            this.localEvents = this.assignPosters(this.parseLocalCSV(csvText));
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
                    locationName: this.extractLocationName(values[5]),
                    locationUrl: this.extractLocationUrl(values[5]),
                    // "host/colab" carries the same "Name: https://url" shape as
                    // Location, and the modal was printing the whole cell — URL
                    // and all — into a fact row.
                    hostColabName: this.extractLocationName(values[4]),
                    hostColabUrl: this.extractLocationUrl(values[4]),
                    lumaEmbedId: this.lumaEmbedId(values[7])
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

    /**
     * Poster matching.
     *
     * This used to be a hardcoded array of 39 filenames plus a keyword fallback,
     * and it went wrong in three ways at once. The array drifted from the folder,
     * so two events pointed at files that no longer existed and one real poster
     * was never reachable. The date had to match to the day, so a CSV date that
     * disagreed with the filename by a few days (QF ETHColombia, Devcon VII)
     * dropped the event to the fallback. And that fallback looped over images on
     * the outside and keywords on the inside, so the FIRST image containing a
     * generic word won every time: six events, including "Ethereum cali Opening"
     * from 2022, were showing the 2025 ETHEREUM NYC poster.
     *
     * Now: the file list comes from events/manifest.json, which is generated
     * from the folder, and matching is a scored one-to-one assignment. A poster
     * is never used twice, the date is a bonus rather than a gate, and anything
     * below the confidence bar gets no image at all — a wrong poster is worse
     * than none.
     */

    async loadPosterManifest() {
        if (this.posters) return this.posters;
        let files = [];
        try {
            files = await (await fetch('events/manifest.json')).json();
        } catch (error) {
            console.error('Error loading events/manifest.json:', error);
        }
        this.posters = files.map((file) => {
            const m = file.match(/^(\d{4})\s+(\d{1,2})\s+(\d{1,2})\s+(.*?)\.[a-z0-9]+$/i);
            return {
                file,
                ymd: m ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}` : null,
                tokens: EventsService.tokenize(m ? m[4] : file.replace(/\.[a-z0-9]+$/i, '')),
            };
        });
        return this.posters;
    }

    /**
     * Luma is the only event host in this data that can be embedded: its
     * /embed/event/<api_id>/simple URL sends no X-Frame-Options, while the plain
     * lu.ma page sends `sameorigin` and Meetup sends CSP `frame-ancestors 'self'`.
     * The api_id is not derivable from the slug and CORS blocks reading it at
     * runtime, so the map is resolved by scripts/resolve-luma-ids.mjs and committed.
     */
    async loadLumaIds() {
        try { this.lumaIds = await (await fetch('databases/luma-embeds.json')).json(); }
        catch (error) { console.error('Error loading databases/luma-embeds.json:', error); }
        return this.lumaIds;
    }

    lumaEmbedId(registrationUrl) {
        const slug = String(registrationUrl ?? '').match(/^https?:\/\/(?:www\.)?lu\.ma\/([A-Za-z0-9]+)/)?.[1];
        return (slug && this.lumaIds[slug]) || null;
    }

    /** Accent- and punctuation-insensitive word set. Digits are kept: they are
     *  what separates "Global Pizza Party 2023" from the 2025 one. */
    static tokenize(text) {
        const STOP = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'en', 'y', 'con',
                              'un', 'una', 'the', 'of', 'and', 'for', 'a']);
        return new Set(String(text ?? '')
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim()
            .split(' ')
            .filter((w) => w.length > 1 && !STOP.has(w)));
    }

    /** DD/MM/YYYY → YYYY-MM-DD, the shape the poster filenames parse to. */
    static isoDate(date) {
        const parts = String(date ?? '').split('/');
        if (parts.length < 3) return null;
        const [d, m, y] = parts;
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    /**
     * Overlap of the two word sets, plus a bonus for agreeing on the date.
     * Returns null when the pair is not good enough to show.
     */
    static score(event, poster) {
        if (!poster.tokens.size || !event.tokens.size) return null;
        let shared = 0;
        for (const t of event.tokens) if (poster.tokens.has(t)) shared += 1;
        if (!shared) return null;

        const overlap = shared / Math.min(event.tokens.size, poster.tokens.size);
        if (overlap < 0.5) return null;

        const exact = Boolean(event.ymd && poster.ymd && event.ymd === poster.ymd);
        const sameMonth = Boolean(event.ymd && poster.ymd && event.ymd.slice(0, 7) === poster.ymd.slice(0, 7));

        // A near-perfect name match stands on its own — that is what rescues the
        // rows whose CSV date disagrees with the filename. Anything weaker has to
        // be corroborated by the date, or it is not shown.
        if (!exact && !sameMonth && overlap < 0.85) return null;

        return overlap + (exact ? 1 : sameMonth ? 0.15 : 0);
    }

    /**
     * Best-first one-to-one assignment. Greedy over every (event, poster) pair
     * sorted by score, which is what stops one generic poster from being handed
     * to six different events.
     */
    assignPosters(events) {
        const rows = events.map((e) => ({
            event: e,
            ymd: EventsService.isoDate(e.date),
            tokens: EventsService.tokenize(e.name),
        }));

        const pairs = [];
        for (const row of rows) {
            for (const poster of this.posters) {
                const score = EventsService.score(row, poster);
                if (score !== null) pairs.push({ row, poster, score });
            }
        }
        pairs.sort((a, b) => b.score - a.score);

        const takenEvent = new Set(), takenPoster = new Set();
        for (const { row, poster } of pairs) {
            if (takenEvent.has(row.event) || takenPoster.has(poster.file)) continue;
            takenEvent.add(row.event);
            takenPoster.add(poster.file);
            row.event.image = EventsService.posterUrl(poster.file);
        }
        return events;
    }

    /**
     * The filename is one path segment and several contain "#" — which the
     * browser reads as the start of a fragment, so "…Meetup #1 + Ethereum
     * Birthday 2024.png" was requested as "…Meetup " and 404'd. Encoding the
     * segment fixes that, and the spaces and "&" along with it.
     */
    static posterUrl(file) {
        return `events/${encodeURIComponent(file)}`;
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

    /** The spreadsheets spell "no value" as NA or a dash. Counting those as if
     *  they were data put an "NA · 9" chip, wearing an Ethereum logo, in the
     *  "Mints de NFT por chain" card. */
    static present(value) {
        const s = String(value ?? '').trim();
        return Boolean(s) && !['na', '-', 'n/a', 'no tiene'].includes(s.toLowerCase());
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
            if (EventsService.present(event.typeContent)) {
                typeContentCounts[event.typeContent] = (typeContentCounts[event.typeContent] || 0) + 1;
            }

            if (EventsService.present(event.typeEvent)) {
                typeEventCounts[event.typeEvent] = (typeEventCounts[event.typeEvent] || 0) + 1;
            }

            // A mint only belongs to a chain if the row actually names one.
            if (EventsService.present(event.chainNft) && EventsService.present(event.mintsNft)) {
                const mints = parseInt(event.mintsNft) || 0;
                if (mints > 0) chainMints[event.chainNft] = (chainMints[event.chainNft] || 0) + mints;
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