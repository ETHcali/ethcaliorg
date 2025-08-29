# Ethereum Cali Website

Official website for Ethereum Cali community - El Jardín Infinito del Pacífico Colombiano.

## 🚀 Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/ETHcali/ethcaliorg.git
cd ethcaliorg

# Install dependencies
npm install

# Start local development server
npm run local
# or
npm run dev

# Open http://localhost:8000
```

### Build for Production
```bash
# Clean and build
npm run build

# Serve built files
npm start
```

## 📁 Project Structure

```
ethcaliorg/
├── css/                    # Stylesheets
├── js/                     # JavaScript files
├── team/                   # Team member photos
├── branding/              # Logos and brand assets
├── events/                # Event images
├── databases/             # CSV data files
├── chains/                # Blockchain logos
├── tools/                 # Tool logos
├── universities/          # University logos
├── gov/                   # Government logos
├── swags/                 # Merchandise images
├── *.html                 # HTML pages
├── package.json           # Node.js configuration
├── vercel.json           # Vercel deployment config
└── README.md             # This file
```

## 🛠 Available Scripts

- `npm run clean` - Remove build directory
- `npm run build` - Build for production
- `npm run vercel-build` - Build for Vercel deployment
- `npm run start` - Serve built files
- `npm run dev` - Development server with live reload
- `npm run local` - Simple Python HTTP server

## 🌐 Pages

- `/` - Home (ethcali.html)
- `/about` - Team page
- `/events` - Events page
- `/venues` - Venues page
- `/education` - Education page
- `/dao` - DAO page
- `/swag` - Merchandise page
- `/technical-infra` - Technical infrastructure
- `/brand-guidelines` - Brand guidelines

## 🚀 Deployment

The site is automatically deployed to Vercel when changes are pushed to the main branch.

### Manual Deployment
1. Push changes to GitHub
2. Vercel will automatically build and deploy
3. Check deployment status at [Vercel Dashboard](https://vercel.com/dashboard)

## 🎨 Team Data

Team member data is stored in `databases/team about us.csv` and dynamically loaded by `js/about.js`.

## 📝 License

ISC License - see package.json for details.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

---

Built with ❤️ by the Ethereum Cali community