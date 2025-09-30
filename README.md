# 🎬 Movie Recommender A/B Test

A research study application built with Vite + React to compare static vs. adaptive movie recommendation systems.

## 🚀 Features

- **A/B Testing Framework**: Randomly assigns users to static or adaptive recommendation groups
- **Movie Data Integration**: Uses TMDB API for movie information and posters
- **Data Collection**: Records user interactions and survey responses via Google Sheets
- **Responsive Design**: Built with Tailwind CSS for optimal user experience
- **Research Focus**: Designed specifically for academic research on recommender systems

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Data Storage**: Google Sheets (via sheet.best)
- **Movie Data**: TMDB API

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- TMDB API key
- Google Sheets + sheet.best endpoint

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "User Interface Project Data Collection Tool"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual API keys and endpoints
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Deployment

This project is configured for easy deployment to platforms like Vercel or Netlify:

### Vercel
```bash
npm run build
# Deploy the dist/ folder
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder
```

## 🔬 Research Context

This application is designed to study user perceptions of different movie recommendation approaches:

- **Group A (Static)**: Movie recommendations remain unchanged after user selections
- **Group B (Adaptive)**: New movies from the same genre appear after each selection

The study measures user satisfaction, perceived helpfulness, and trust in the recommendation system.

## 📊 Data Collection

The application collects:
- User demographics (name, student ID)
- Movie selection events
- Survey responses (Likert scales + open feedback)
- Interaction timestamps
- A/B test group assignments

All data is stored in Google Sheets for analysis.

## 🤝 Contributing

This is a research project. Please follow the sprint plan in `Requirements.md` for development guidelines.

## 📄 License

This project is for academic research purposes.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
