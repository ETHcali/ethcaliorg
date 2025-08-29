// Complete team data from CSV
console.log('About-simple.js loaded with complete team data');

const teamData = [
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
        twitter: "https://twitter.com/juan21179",
        github: ""
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
        twitter: "https://twitter.com/marimarketingw3",
        github: ""
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
        twitter: "https://twitter.com/juaNFT_ETH",
        github: ""
    },
    {
        name: "Cristobal Valencia",
        role: "Full Stack Developer",
        description: "Core member desde Abril 2025. Desarrollador full stack del ecosistema.",
        status: "Core",
        image: "team/cristobal.jpg",
        linkedin: "https://www.linkedin.com/in/cristobalvalenciaceron",
        twitter: "https://x.com/DevCristobalvc",
        github: "https://github.com/DevCristobalvc"
    },
    {
        name: "Juan David Burgos",
        role: "Lawyer",
        description: "Core member desde Mayo 2025. Asesor legal especializado en tecnologías blockchain.",
        status: "Core",
        image: "team/juan david burgos.jpg",
        linkedin: "https://www.linkedin.com/in/juan-david-burgos-giraldo-0000000000",
        twitter: "https://x.com/JuanBK_ethcali",
        github: ""
    },
    {
        name: "Saeta Florez",
        role: "DAO and Talent Manager",
        description: "DAO coordinator desde Mayo 2025. Desarrollador web3 especializado en tecnologías blockchain.",
        status: "Core",
        image: "team/saeta.png",
        linkedin: "https://www.linkedin.com/in/saeta7/",
        twitter: "https://x.com/Hortelana_eth",
        github: ""
    },
    {
        name: "Miguel Bolaños",
        role: "Front End Developer",
        description: "Core member desde Noviembre 2023. Desarrollador frontend especializado en interfaces Web3.",
        status: "Contribuidor",
        image: "team/miguel bolanos.png",
        linkedin: "",
        twitter: "https://twitter.com/MAB015",
        github: ""
    },
    {
        name: "Adriana Lucema",
        role: "Project Manager, Web3 Product Manager",
        description: "Contribuidora desde Mayo 2024. Gestora de proyectos y productos Web3.",
        status: "Contribuidor",
        image: "team/adriana_lucema.png",
        linkedin: "https://www.linkedin.com/in/adriana-lucema/",
        twitter: "https://twitter.com/AdriLucema",
        github: ""
    },
    {
        name: "Jose Luis Rivas",
        role: "Educador, Web3 Hacker",
        description: "Contribuidor desde Enero 2023. Educador y hacker especializado en Web3.",
        status: "Contribuidor",
        image: "team/joseluisrivas.png",
        linkedin: "https://www.linkedin.com/in/jlrivasv/",
        twitter: "https://twitter.com/cointaigas",
        github: ""
    },
    {
        name: "Camilo Sacanamboy",
        role: "Entrepreneur, WEB3 Developer",
        description: "Contribuidor desde Enero 2023. Emprendedor y desarrollador Web3.",
        status: "Contribuidor",
        image: "team/camilosacanamboy.png",
        linkedin: "https://www.linkedin.com/in/camilosaka/",
        twitter: "https://twitter.com/camilosaka",
        github: ""
    },
    {
        name: "Andres Jimenez",
        role: "Entrepreneur",
        description: "Contribuidor desde Octubre 2022. Emprendedor del ecosistema.",
        status: "Contribuidor",
        image: "team/andresjimenez.png",
        linkedin: "https://www.linkedin.com/in/andresfjimenez/",
        twitter: "https://twitter.com/Andresjimenezv",
        github: ""
    },
    {
        name: "Camilo Tobar",
        role: "Entrepreneur, Web3 Hacker",
        description: "Contribuidor desde Octubre 2022. Emprendedor y hacker Web3.",
        status: "Contribuidor",
        image: "team/camilotobar.png",
        linkedin: "https://www.linkedin.com/in/camilotobarn/",
        twitter: "",
        github: ""
    }
];

function createTeamCard(member) {
    const statusClass = member.status.toLowerCase();
    
    // Create social links
    let socialLinks = '';
    if (member.linkedin) {
        socialLinks += `<a href="${member.linkedin}" target="_blank" class="social-link linkedin" title="LinkedIn">
            <i class="fab fa-linkedin-in"></i>
        </a>`;
    }
    if (member.twitter) {
        socialLinks += `<a href="${member.twitter}" target="_blank" class="social-link twitter" title="Twitter/X">
            <i class="fab fa-twitter"></i>
        </a>`;
    }
    if (member.github) {
        socialLinks += `<a href="${member.github}" target="_blank" class="social-link github" title="GitHub">
            <i class="fab fa-github"></i>
        </a>`;
    }

    return `
        <div class="cyber-card">
            <div class="status-badge ${statusClass}">${member.status}</div>
            <div class="card-header">
                <div class="card-avatar">
                    <img src="${member.image}" alt="${member.name}" loading="lazy" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
                         style="opacity:1;" />
                    <div class="card-placeholder" style="display:none;">${member.name.charAt(0)}</div>
                </div>
                <div class="card-info">
                    <h3>${member.name}</h3>
                    <div class="card-role">${member.role}</div>
                </div>
            </div>
            <p class="card-description">${member.description}</p>
            <div class="card-social">
                ${socialLinks}
            </div>
        </div>
    `;
}

function renderAllTeamMembers() {
    console.log('renderAllTeamMembers called');
    
    const container = document.getElementById('team-grid');
    console.log('Container found:', container);
    
    if (!container) {
        console.error('No team-grid container found');
        return;
    }

    // Generate HTML for all team members
    const teamHTML = teamData.map(member => createTeamCard(member)).join('');
    
    // Inject all team members
    container.innerHTML = teamHTML;
    
    console.log(`Successfully rendered ${teamData.length} team members`);
}

// Multiple ways to ensure this runs - especially for Vercel
function initTeamRender() {
    console.log('Attempting to render team...');
    console.log('Document ready state:', document.readyState);
    
    const container = document.getElementById('team-grid');
    console.log('Container found:', container);
    
    if (container) {
        renderAllTeamMembers();
    } else {
        console.log('Container not found, retrying in 100ms');
        setTimeout(initTeamRender, 100);
    }
}

// Try immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTeamRender);
} else {
    initTeamRender();
}

// Additional fallbacks for Vercel
window.addEventListener('load', initTeamRender);
setTimeout(initTeamRender, 100);
setTimeout(initTeamRender, 500);
setTimeout(initTeamRender, 1000);
setTimeout(initTeamRender, 2000);
