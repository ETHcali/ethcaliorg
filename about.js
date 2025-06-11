/**
 * About Us Page - Team Management
 * Professional team member display with social links
 */

class TeamManager {
    constructor() {
        this.teamContainer = document.getElementById('team-grid');
        this.teamMembers = [
            // Core Team Members
            {
                name: "William Martinez",
                role: "Economist, Project Manager, Web3 Hacker",
                description: "Core member desde Octubre 2022. Visionario y líder del ecosistema Ethereum Cali.",
                status: "Core",
                image: "team/william.png",
                linkedin: "https://www.linkedin.com/in/williammartinez8/",
                twitter: "https://twitter.com/0xwmb",
                github: "https://github.com/wmb81321"
            },
            {
                name: "Juan Urrea",
                role: "Researcher, Web3 Hacker", 
                description: "Core member desde Octubre 2022. Investigador y hacker especializado en Web3.",
                status: "Core",
                image: "team/Juanurrea.png",
                linkedin: "",
                twitter: "https://twitter.com/juan21179"
            },
            {
                name: "Filadelfo Caicedo",
                role: "Economist, Trader, Web3 Researcher",
                description: "Core member desde Octubre 2023. Economista y trader especializado en investigación Web3.",
                status: "Core", 
                image: "team/filadelfo.png",
                linkedin: "https://www.linkedin.com/in/filadelfo-caicedo/",
                twitter: "https://twitter.com/Filatrader",
                github: "https://github.com/phill900"
            },
            {
                name: "Maria del Mar Borrero",
                role: "Community Manager, Digital Marketing",
                description: "Core member desde Febrero 2024. Gestora de comunidad y especialista en marketing digital.",
                status: "Core",
                image: "team/maria del mar.png",
                linkedin: "https://www.linkedin.com/in/mariadelmarborrerog/",
                twitter: "https://twitter.com/marimarketingw3"
            },
            {
                name: "Jose Bailon",
                role: "WEB3 Developer",
                description: "Core member desde Agosto 2023. Desarrollador especializado en tecnologías Web3.",
                status: "Core",
                image: "team/juan jose bailon.png",
                linkedin: "https://linkedin.com/in/juan-bailon-ab3767192",
                twitter: "",
                github: "https://github.com/juanbailon"
            },
            {
                name: "Juan Esteban Sierra",
                role: "Business Developer, NFT Strategy",
                description: "Core member desde Diciembre 2022. Desarrollador de negocios y estratega NFT.",
                status: "Core",
                image: "team/juan esteban sierra.png",
                linkedin: "https://www.linkedin.com/in/juanfteth/",
                twitter: "https://twitter.com/juaNFT_ETH"
            },
            {
                name: "Miguel Bolaños",
                role: "Front End Developer",
                description: "Core member desde Noviembre 2023. Desarrollador frontend especializado en interfaces Web3.",
                status: "Core",
                image: "team/miguel bolanos.png",
                linkedin: "",
                twitter: "https://twitter.com/MAB015"
            },
            {
                name: "Cristobal Valencia",
                role: "Full Stack Developer",
                description: "Core member desde Abril 2025. Desarrollador full stack del ecosistema.",
                status: "Core",
                image: "",
                linkedin: "",
                twitter: ""
            },
            {
                name: "Juan David Burgos",
                role: "Lawyer",
                description: "Core member desde Mayo 2025. Asesor legal especializado en tecnologías blockchain.",
                status: "Core",
                image: "",
                linkedin: "",
                twitter: ""
            },
            // Contributors
            {
                name: "Adriana Lucema",
                role: "Project Manager, Web3 Product Manager",
                description: "Contribuidora desde Mayo 2024. Gestora de proyectos y productos Web3.",
                status: "Contribuidor",
                image: "team/adriana_lucema.png",
                linkedin: "https://www.linkedin.com/in/adriana-lucema/",
                twitter: "https://twitter.com/AdriLucema"
            },
            {
                name: "Jose Luis Rivas",
                role: "Educador, Web3 Hacker",
                description: "Contribuidor desde Enero 2023. Educador y hacker especializado en Web3.",
                status: "Contribuidor",
                image: "team/joseluisrivas.png",
                linkedin: "https://www.linkedin.com/in/jlrivasv/",
                twitter: "https://twitter.com/cointaigas"
            },
            {
                name: "Camilo Sacanamboy",
                role: "Entrepreneur, WEB3 Developer",
                description: "Contribuidor desde Enero 2023. Emprendedor y desarrollador Web3.",
                status: "Contribuidor",
                image: "team/camilosacanamboy.png",
                linkedin: "",
                twitter: "https://twitter.com/camilosaka"
            },
            {
                name: "Andres Jimenez",
                role: "Entrepreneur",
                description: "Contribuidor desde Octubre 2022. Emprendedor del ecosistema.",
                status: "Contribuidor",
                image: "team/andresjimenez.png",
                linkedin: "",
                twitter: "https://twitter.com/Andresjimenezv"
            },
            {
                name: "Camilo Tobar",
                role: "Entrepreneur, Web3 Hacker",
                description: "Contribuidor desde Octubre 2022. Emprendedor y hacker Web3.",
                status: "Contribuidor",
                image: "team/camilotobar.png",
                linkedin: "",
                twitter: ""
            }
        ];
        
        this.init();
    }

    init() {
        this.renderTeam();
    }

    renderTeam() {
        if (!this.teamContainer) {
            console.error('Team container not found');
            return;
        }

        this.teamContainer.innerHTML = '';

        this.teamMembers.forEach(member => {
            const teamCard = this.createTeamCard(member);
            this.teamContainer.appendChild(teamCard);
        });
    }

    createTeamCard(member) {
        const card = document.createElement('div');
        card.classList.add('cyber-card');

        card.innerHTML = `
            ${member.status ? 
                `<div class="status-badge ${member.status.toLowerCase()}">${member.status}</div>` : 
                ''
            }
            <div class="card-header">
                <div class="card-avatar">
                    ${member.image ? 
                        `<img src="${member.image}" alt="${member.name}" />` :
                        `<div class="card-placeholder">${member.name.charAt(0)}</div>`
                    }
                </div>
                <div class="card-info">
                    <h3>${member.name}</h3>
                    <div class="card-role">${member.role}</div>
                </div>
            </div>
            ${member.description ? 
                `<p class="card-description">${member.description}</p>` : 
                ''
            }
            <div class="card-social">
                ${member.linkedin ? 
                    `<a href="${member.linkedin}" target="_blank" class="social-link linkedin" title="LinkedIn">
                        <i class="fab fa-linkedin-in"></i>
                    </a>` : 
                    ''
                }
                ${member.twitter ? 
                    `<a href="${member.twitter}" target="_blank" class="social-link twitter" title="Twitter/X">
                        <i class="fab fa-twitter"></i>
                    </a>` : 
                    ''
                }
                ${member.github ? 
                    `<a href="${member.github}" target="_blank" class="social-link github" title="GitHub">
                        <i class="fab fa-github"></i>
                    </a>` : 
                    ''
                }
            </div>
        `;

        return card;
    }

    // Method to update team data (can be called externally)
    updateTeamData(newTeamData) {
        this.teamMembers = newTeamData;
        this.renderTeam();
    }

    // Method to add a single team member
    addTeamMember(member) {
        this.teamMembers.push(member);
        this.renderTeam();
    }

    // Method to validate team member data
    validateMember(member) {
        const required = ['name', 'role'];
        const optional = ['description', 'image', 'linkedin', 'twitter'];
        
        // Check required fields
        for (let field of required) {
            if (!member[field] || member[field].trim() === '') {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Validate URLs if provided
        if (member.linkedin && !this.isValidURL(member.linkedin)) {
            throw new Error('Invalid LinkedIn URL');
        }
        
        if (member.twitter && !this.isValidURL(member.twitter)) {
            throw new Error('Invalid Twitter URL');
        }

        return true;
    }

    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

// Initialize team manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const teamManager = new TeamManager();
    
    // Make teamManager globally available for external data updates
    window.teamManager = teamManager;
});

// Example function to update team data from external source
function loadTeamFromNotion(teamData) {
    if (window.teamManager) {
        try {
            // Validate all team members
            teamData.forEach(member => {
                window.teamManager.validateMember(member);
            });
            
            // Update team data
            window.teamManager.updateTeamData(teamData);
            console.log('Team data updated successfully');
        } catch (error) {
            console.error('Error updating team data:', error);
        }
    }
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeamManager;
} 