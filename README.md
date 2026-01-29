# QobuzPulse 🎵

QobuzPulse is an end-to-end music analytics project that simulates a real-world
streaming analytics pipeline using a Spotify tracks dataset as a proxy for
Qobuz-style metadata. The project focuses on data quality, dimensional modeling,
and interactive web-based analytics for insight discovery.

---

## Project Objective

The goal of this project is to:
- Ingest raw music metadata from Spotify
- Clean and validate the data responsibly
- Design a dimensional (star) schema
- Build interactive web dashboards for data exploration
- Perform analytics to discover trends and insights

---

## Data Source

- **Dataset:** Public Spotify Tracks dataset  
- **Granularity:** Track-level metadata with audio features  
- **Scale:** 113,949 clean records  
- **Notes:**  
  - Repeated track identifiers are expected  
  - Multi-genre classification is preserved intentionally
  - Blank/corrupted rows have been removed  

---

## Repository Structure

```
qobuzpulse/
├── raw_data/
│   └── spotify/
│       └── dataset.csv
├── cleaned_data/
│   └── tracks_cleaned.csv
├── website/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Artists.jsx
│   │   │   ├── Genres.jsx
│   │   │   ├── Tracks.jsx
│   │   │   ├── Momentum.jsx
│   │   │   └── Insights.jsx
│   │   └── utils/
│   ├── public/
│   │   └── tracks_cleaned.csv
│   └── package.json
├── data_mart/
│   └── sqlite/
├── dashboard/
├── docs/
│   ├── data_dictionary.md
│   ├── data_cleaning_and_validation.md
│   ├── data_quality_scorecard.md
│   └── star_schema.md
└── README.md
```

---

## Web Dashboard

An interactive React-based web dashboard has been built to visualize and explore the music data:

### Features:
- **Home:** Overview statistics and key metrics
- **Artists:** Artist rankings, track counts, and popularity analysis
- **Genres:** Genre distribution, audio features comparison, and growth trends
- **Tracks:** Searchable/filterable track listing with detailed metadata
- **Momentum:** Artist momentum scoring based on popularity and track performance
- **Insights:** Data quality overview and analytical summaries

### Technology Stack:
- **Frontend:** React + Vite
- **Styling:** TailwindCSS
- **Charts:** Recharts
- **Data Loading:** PapaParse (CSV parsing)

### Running the Dashboard:
```bash
cd website
npm install
npm run dev
```
Visit: `http://localhost:3001`

---

## Data Preparation & Quality

Key data preparation steps include:
- Removal of invalid/corrupt records in critical identifiers
- Careful duplicate investigation using business attributes
- Preservation of valid multi-genre and contextual track variations
- Text standardization for analytical consistency
- Export of a clean, analysis-ready dataset

Detailed documentation is available in:
- `docs/data_cleaning_and_validation.md`
- `docs/data_quality_scorecard.md`
- `docs/data_dictionary.md`

---

## Dimensional Modeling

A star schema has been designed to support analytics and reporting:
- **Fact table:** Track-level metrics and audio features
- **Dimensions:** Artist, Album, Genre

The schema is documented visually using draw.io and will be implemented
in a SQLite database in the next phase.

---

## Current Status

✅ **Completed:**
- Raw data ingestion and profiling
- Data cleaning and validation
- Clean dataset export (113,949 tracks)
- Data dictionary and quality documentation
- Star schema design
- **Interactive web dashboard with 6 analytical pages**
- Responsive UI with modern visualizations

🚧 **In Progress:**
- SQLite database implementation
- Advanced analytical queries
- Additional dashboard features

---

## Next Steps

- Load cleaned data into SQLite tables
- Generate dimension and fact tables
- Perform complex analytical queries
- Add export/download features to dashboard
- Implement additional data filters and sorting options

---

## Notes

This project emphasizes **data correctness and analytical integrity**
over aggressive cleaning or premature optimization. All decisions are
documented and reproducible.

---

## Author

Apurva  
(Data Analytics / BI / Analytics Engineering)
