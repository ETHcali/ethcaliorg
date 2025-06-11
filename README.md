# ETH Cali Organization Website 🚀

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://ethcali.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-ethcaliorg-blue?logo=github)](https://github.com/wmb81321/ethcaliorg)

The official website for **Ethereum Cali**, showcasing the vibrant Ethereum community in Cali, Colombia and global Ethereum events.

## 🌟 Features

### 🎯 **Events Section**
- **80+ Global Ethereum Events** for 2025 loaded from CSV data
- **Responsive card layout** that works on all devices
- **Interactive filtering** by month
- **Real-time event data** with complete location information
- **Direct links** to event websites, social media, and community chats

### 👥 **About Section**
- **Core team profiles** with photos and descriptions
- **Community mission** and values
- **Interactive team member cards**

### 🏢 **Venues Section**
- **Local Ethereum venues** in Cali
- **Community spaces** and coworking locations
- **Event hosting information**

### 🎨 **Design Features**
- **Cyber-punk themed UI** with modern aesthetics
- **Fully responsive design** (mobile-first approach)
- **Custom Sarun Pro typography**
- **Smooth animations** and hover effects
- **Dark theme** optimized for developers

## 🚀 Live Demo

Visit the live website: **[ethcali.vercel.app](https://ethcali.vercel.app)**

### 📱 Pages
- **Home**: `/ethcali.html` - Main landing page
- **Events**: `/events.html` - Global Ethereum events 2025
- **About**: `/about.html` - Team and community info
- **Venues**: `/ethcalivenues.html` - Local venues and spaces

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Data**: CSV parsing for events data
- **Deployment**: Vercel
- **Version Control**: Git & GitHub

## 📁 Project Structure

```
ethcaliorg/
├── 📄 ethcali.html          # Main landing page
├── 📄 events.html           # Events page
├── 📄 about.html            # About page  
├── 📄 ethcalivenues.html    # Venues page
├── 📄 navbar.html           # Shared navigation
├── 📄 footer.html           # Shared footer
├── 🎨 style_ethcali.css     # Main page styles
├── 🎨 style_events.css      # Events page styles
├── 🎨 style_about.css       # About page styles
├── 🎨 shared-components.css # Shared components
├── ⚡ events.js             # Events functionality
├── ⚡ about.js              # About page functionality
├── ⚡ navbar.js             # Navigation functionality
├── 📊 2025ethereumevents.csv # Events data
├── 🖼️ branding/             # Logos and brand assets
├── 👥 team/                 # Team member photos
└── 🔤 Sarun Pro/            # Custom font files
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Local development server (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/wmb81321/ethcaliorg.git
   cd ethcaliorg
   ```

2. **Start a local server**
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000/ethcali.html
   ```

## 📊 Events Data Structure

The events are loaded from `2025ethereumevents.csv` with the following structure:

```csv
Event,startDate,endDate,Geo,Link,Social,Chat
ETHDenver,February 23,March 2,"Denver, USA",ethdenver.com,ethereumdenver,discord.gg/sporkdao
```

### Fields:
- **Event**: Event name
- **startDate**: Start date (Month Day format)
- **endDate**: End date (Month Day format)
- **Geo**: Complete location ("City, Country Code")
- **Link**: Main website URL (used for Discover button)
- **Social**: Twitter/X handle or social media
- **Chat**: Telegram/Discord community link

## 🎨 Responsive Design

The website is optimized for all screen sizes:

- **📱 Mobile**: 320px - 767px (1 column)
- **📱 Tablet**: 768px - 1099px (2 columns)
- **💻 Desktop**: 1100px - 1399px (3 columns)
- **🖥️ Large Desktop**: 1400px+ (4+ columns)

## 🚀 Deployment

The website is automatically deployed to Vercel:

1. **Push changes** to the main branch
2. **Vercel automatically builds** and deploys
3. **Live site updates** within minutes

### Vercel Configuration
```json
{
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Adding Events
To add new events, update the `2025ethereumevents.csv` file following the existing format.

## 📞 Community

- **Discord**: [Join our community](https://discord.gg/GvkDmHnDuE)
- **Twitter**: [@EthereumCali](https://twitter.com/EthereumCali)
- **Website**: [ethcali.vercel.app](https://ethcali.vercel.app)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Ethereum Foundation** for the inspiration
- **Cali Ethereum Community** for the support
- **Global Ethereum Community** for the events data
- **Vercel** for hosting

---

**Built with ❤️ by the Ethereum Cali community**

*Connecting builders, innovators, and visionaries in Cali, Colombia and beyond.* 