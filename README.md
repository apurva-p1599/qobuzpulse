# QobuzPulse 🎵

QobuzPulse is an end-to-end music analytics project that simulates a real-world
streaming analytics pipeline using a Spotify tracks dataset as a proxy for
Qobuz-style metadata. The project focuses on data quality, dimensional modeling,
and analytical insights rather than raw ingestion alone.

---

## Project Objective

The goal of this project is to:
- Ingest raw music metadata
- Clean and validate the data responsibly
- Design a dimensional (star) schema
- Store curated data in a relational database
- Perform analytics and build dashboards for insight discovery

---

## Data Source

- **Dataset:** Public Spotify Tracks dataset  
- **Granularity:** Track-level metadata with audio features  
- **Scale:** ~114,000 records  
- **Notes:**  
  - Repeated track identifiers are expected  
  - Multi-genre classification is preserved intentionally  

---

## Repository Structure

qobuzpulse/
├── raw_data/
│ └── spotify/
│ └── dataset.csv
├── cleaned_data/
│ └── tracks_cleaned.csv
├── data_mart/
│ └── (SQLite database files – in progress)
├── dashboard/
│ └── (Power BI dashboards – in progress)
├── docs/
│ ├── data_dictionary.md
│ ├── data_cleaning_and_validation.md
│ ├── data_quality_scorecard.md
│ └── star_schema.drawio
├── requirements.txt
└── README.md


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

Completed:
- Raw data ingestion and profiling
- Data cleaning and validation
- Clean dataset export
- Data dictionary and quality documentation
- Star schema design

In progress:
- SQLite database implementation
- Analytical queries
- Dashboard development (Power BI)

---

## Next Steps

- Load cleaned data into SQLite tables
- Generate dimension and fact tables
- Perform analytical queries
- Build interactive dashboards for insights

---

## Notes

This project emphasizes **data correctness and analytical integrity**
over aggressive cleaning or premature optimization. All decisions are
documented and reproducible.

---

## Author

Apurva  
(Data Analytics / BI / Analytics Engineering)
