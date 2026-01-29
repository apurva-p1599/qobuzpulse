# QobuzPulse Website

A modern React + Vite web application for exploring and analyzing music data from the QobuzPulse project.

## Features

- 🏠 **Home Dashboard**: Overview with key metrics and visualizations
- 🎤 **Artists Explorer**: Search and analyze artists in your collection
- 🎵 **Genre Analysis**: Deep dive into genre statistics and characteristics
- 🎧 **Track Browser**: Advanced search, filter, and sort capabilities
- 📊 **Insights**: Analytics and correlations between audio features

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling with dark theme
- **Recharts** - Data visualization
- **React Router** - Navigation
- **PapaParse** - CSV parsing

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Data Source

The application reads data from `../cleaned_data/tracks_cleaned.csv` (relative to the website folder).

**Note**: If you encounter CORS issues when loading the CSV file, you may need to:
- Serve the application from the project root directory, or
- Copy `cleaned_data/tracks_cleaned.csv` to `website/public/` and update the path in `src/utils/csvLoader.js`

## Project Structure

```
website/
├── src/
│   ├── components/     # Reusable components (Navigation, Layout)
│   ├── pages/         # Page components (Home, Artists, Genres, Tracks, Insights)
│   ├── utils/         # Utility functions (CSV loader, formatters)
│   ├── App.jsx        # Main app component with routing
│   ├── main.jsx       # Entry point
│   └── index.css      # Global styles
├── index.html         # HTML template
├── package.json       # Dependencies
├── vite.config.js     # Vite configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Features Overview

### Home Page
- Statistics cards (total tracks, artists, genres, etc.)
- Top genres bar chart
- Popularity distribution
- Genre pie chart

### Artists Page
- Searchable artist list
- Sort by track count or popularity
- Top artists visualization
- Genre tags for each artist

### Genres Page
- Genre statistics and rankings
- Audio features analysis by genre
- Interactive genre selection with radar charts
- Multiple visualization types

### Tracks Page
- Full track listing with pagination
- Advanced search and filtering
- Sortable columns
- Multiple sort options

### Insights Page
- Popularity trends by genre
- Duration distribution
- Energy vs Valence scatter plot
- Tempo and key analysis
- Feature correlations

## Styling

The application uses a dark theme with blue/purple gradient accents. All components are fully responsive and optimized for desktop and mobile viewing.

## License

Part of the QobuzPulse project.

