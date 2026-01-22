// Complete team data from CSV
console.log('About-simple.js loaded with complete team data');

const teamData = [
    { name: "William Martinez", role: "Founder, Economist, Project Manager", status: "Founder", since: "01/10/2022", image: "team/william.png", linkedin: "https://www.linkedin.com/in/williammartinez8/", twitter: "https://twitter.com/0xwmb", github: "https://github.com/wmb81321" },
    { name: "Juan Urrea", role: "Researcher, Web3 Hacker", status: "Founder", since: "01/10/2022", image: "team/Juanurrea.png", linkedin: "", twitter: "https://twitter.com/juan21179", github: "" },
    { name: "Filadelfo Caicedo", role: "Economist, Trader, Web3 Researcher", status: "Core", since: "01/10/2023", image: "team/filadelfo.png", linkedin: "https://www.linkedin.com/in/filadelfo-caicedo/", twitter: "https://twitter.com/Filatrader", github: "https://github.com/phill900" },
    { name: "Maria del Mar Borrero", role: "Community Manager, Digital Marketing", status: "Core", since: "01/02/2024", image: "team/mariadelmar.png", linkedin: "https://www.linkedin.com/in/mariadelmarborrerog/", twitter: "https://twitter.com/marimarketingw3", github: "" },
    { name: "Jose Bailon", role: "Back-end Developer", status: "Core", since: "01/08/2023", image: "team/juan jose bailon.png", linkedin: "https://linkedin.com/in/juan-bailon-ab3767192", twitter: "", github: "https://github.com/juanbailon" },
    { name: "Cristobal Valencia", role: "FullStack Developer", status: "Contributor", since: "01/04/2025", image: "team/cristobal.jpg", linkedin: "https://www.linkedin.com/in/cristobalvalenciaceron", twitter: "https://x.com/DevCristobalvc", github: "https://github.com/DevCristobalvc" },
    { name: "Juan David Burgos", role: "Lawyer", status: "Contributor", since: "01/05/2025", image: "team/juan david burgos.jpg", linkedin: "https://www.linkedin.com/in/juan-david-burgos-cantor-1603b3196/", twitter: "https://x.com/JuanBK_ethcali", github: "https://github.com/orgs/Ekinoxis-evm/people/juandavid883" },
    { name: "Luis Waitoto", role: "Web2 dev in course + logistics coordinator", status: "Volunteer", since: "01/11/2025", image: "team/luiswaitoto.jpg", linkedin: "https://www.linkedin.com/in/luiswaitoto-/", twitter: "", github: "" },
    { name: "John Alex", role: "Web2 dev in course", status: "Volunteer", since: "01/11/2025", image: "team/jhonalex.jpg", linkedin: "https://www.linkedin.com/in/jhonnalexandertorrescastro/", twitter: "", github: "https://github.com/orgs/Ekinoxis-evm/people/DevJhonnTorres" },
    { name: "Camilo Ramirez", role: "Fullstack developer", status: "Volunteer", since: "01/11/2025", image: "team/camiloramirez.png", linkedin: "https://www.linkedin.com/in/camilo-ram%C3%ADrez-villegas/", twitter: "", github: "" },
    { name: "Susan Taborda", role: "Web2 Dev in course", status: "Volunteer", since: "01/11/2025", image: "team/susantaborda.png", linkedin: "https://www.linkedin.com/in/susan-taborda/", twitter: "https://x.com/tabordasusan", github: "" },
    { name: "Miguel Bolanos", role: "Front-end and UXUI dev", status: "Volunteer", since: "01/11/2025", image: "team/miguelbolanos.png", linkedin: "https://www.linkedin.com/in/mab015/", twitter: "https://twitter.com/MAB015", github: "https://github.com/MAB015/MAB015" },
    { name: "Laura Castro", role: "Lawyer and Customer Success", status: "Volunteer", since: "01/11/2025", image: "team/lauracastro.jpg", linkedin: "https://www.linkedin.com/in/launacg", twitter: "", github: "" },
    { name: "Camilo Sacanamboy", role: "Founder, WEB3 Developer", status: "Volunteer", since: "01/01/2023", image: "team/camilosacanamboy.png", linkedin: "https://www.linkedin.com/in/camilosaka/", twitter: "https://twitter.com/camilosaka", github: "https://github.com/csacanam" },
    { name: "Juan Esteban Sierra", role: "Business Developer, NFT Strategy", status: "Former Core", since: "01/12/2022", image: "team/juan esteban sierra.png", linkedin: "https://www.linkedin.com/in/juanfteth/", twitter: "https://twitter.com/juaNFT_ETH", github: "" },
    { name: "Saeta Florez", role: "DAO and Talent Manager", status: "Former Core", since: "01/05/2025", image: "team/saeta.png", linkedin: "https://www.linkedin.com/in/saeta7/", twitter: "https://x.com/Hortelana_eth", github: "" },
    { name: "Adriana Lucema", role: "Project Manager, Web3 Product Manager", status: "Former Core", since: "01/06/2023", image: "team/adriana_lucema.png", linkedin: "https://www.linkedin.com/in/adriana-lucema/", twitter: "https://twitter.com/AdriLucema", github: "" },
    { name: "Jose Luis Rivas", role: "Educador, Web3 Hacker", status: "Former Core", since: "01/01/2023", image: "team/joseluisrivas.png", linkedin: "https://www.linkedin.com/in/jlrivasv/", twitter: "https://twitter.com/cointaigas", github: "" },
    { name: "Andres Jimenez", role: "Founder", status: "Former Core", since: "01/10/2022", image: "team/andresjimenez.png", linkedin: "https://www.linkedin.com/in/andresfjimenez/", twitter: "https://twitter.com/Andresjimenezv", github: "" },
    { name: "Camilo Tobar", role: "Founder, Web3 Hacker", status: "Former Core", since: "01/10/2022", image: "team/camilotobar.png", linkedin: "https://www.linkedin.com/in/camilotobarn/", twitter: "", github: "" }
];

function createTeamCard(member) {
    // Assign color class based on status
    let statusClass = "";
    switch (member.status) {
        case "Founder": statusClass = "founder"; break;
        case "Core": statusClass = "core"; break;
        case "Contributor": statusClass = "contributor"; break;
        case "Volunteer": statusClass = "volunteer"; break;
        case "Former Core": statusClass = "former-core"; break;
        default: statusClass = "other";
    }
    
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
                    <div class="card-since">Desde: ${member.since}</div>
                </div>
            </div>
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
