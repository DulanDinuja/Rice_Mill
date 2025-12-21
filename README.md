<<<<<<< HEAD
# SAMEERA RICE - Inventory Management System (Gaming Mod UI)

A modern, production-ready React application for rice and paddy stock inventory management with gaming aesthetics and glass morphism design.

## 🎮 Features

- **Gaming Mod UI**: Neon colors, glass morphism effects, and cyber aesthetics
- **Stock Management**: Manage rice and paddy inventory with real-time updates
- **Dashboard Analytics**: Visual insights with interactive charts
- **Warehouse Monitoring**: Track capacity, temperature, and humidity
- **Authentication**: JWT-based secure login system
- **Responsive Design**: Works seamlessly on all devices
- **Mock Data**: Built-in fallback for development without backend

## 🚀 Tech Stack

- **React 18+** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 📦 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
```

4. **Preview production build:**
```bash
npm run preview
```

## 🎨 Design System

### Color Palette
- **Primary (Neon Green)**: #00FF88
- **Secondary (Cyber Purple)**: #8A2BE2
- **Accent (Electric Cyan)**: #00D9FF
- **Dark Background**: #0A0A0A

### Glass Morphism
The UI uses iOS 26-inspired glass effects with:
- Backdrop blur filters
- Semi-transparent backgrounds
- Subtle borders with neon accents
- Smooth hover transitions

## 🔐 Authentication

**Demo Credentials:**
- Email: `admin@sameera.com`
- Password: Any password (mock authentication)

## 📱 Pages

1. **Dashboard** - Overview with stats and recent activity
2. **Rice Stock** - Manage rice inventory with search and filters
3. **Paddy Stock** - Track paddy with moisture levels
4. **Reports** - Analytics with interactive charts
5. **Warehouse** - Monitor warehouse capacity and conditions
6. **Settings** - System preferences

## 🛠️ Project Structure

```
src/
├── assets/styles/      # CSS files (glass, animations)
├── components/
│   ├── layout/        # Sidebar, Navbar
│   ├── ui/            # Reusable UI components
│   ├── dashboard/     # Dashboard-specific components
│   └── stock/         # Stock management components
├── pages/             # Route pages
├── services/
│   ├── api/          # API integration
│   └── mock/         # Mock data
├── context/          # React Context (Auth)
├── utils/            # Helper functions
└── routes/           # Route configuration
```

## 🎯 Key Components

### GlassCard
Reusable card with glass morphism effect
```jsx
<GlassCard hover={true}>Content</GlassCard>
```

### NeonButton
Gaming-style button with neon effects
```jsx
<NeonButton variant="primary" loading={false}>Click Me</NeonButton>
```

### CyberInput
Input field with cyber aesthetics
```jsx
<CyberInput label="Email" icon={Mail} />
```

## 🔌 API Integration

The app uses Axios with interceptors for JWT authentication. Toggle between mock and real API:

```javascript
// In src/services/api/stockService.js
const USE_MOCK = true; // Set to false for real API
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color palette.

### Animations
Modify `src/assets/styles/animations.css` for custom animations.

### Glass Effects
Adjust `src/assets/styles/glass.css` for glass morphism intensity.

## 📊 Mock Data

Sample data is provided in `src/services/mock/stockData.js` for:
- Rice stocks
- Paddy stocks
- Warehouses

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting

## 🔧 Environment Variables

Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## 📝 License

MIT License - Feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and component patterns.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using React + Gaming Aesthetics**
=======
# Rice_Mill
SAMEERA_RICE
>>>>>>> 85265342cd7c9e13c135aad97fdc19373aa45a07
