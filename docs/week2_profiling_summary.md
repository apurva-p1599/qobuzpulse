# Week 2 – Raw Data Profiling Summary

## Objective
The goal of Week 2 is to understand the structure, completeness, and quality of the raw dataset
before performing any cleaning or transformations. No records are modified or removed in this stage.

---

## Dataset Overview
- **Source:** Public Spotify Tracks Dataset (used as Qobuz proxy)
- **File Name:** dataset.csv
- **Total Rows:** ~114,000
- **Total Columns:** 20
- **Format:** CSV
- **Data Status:** Read-only (raw data preserved)

---

## Column Categories
| Category | Columns |
|-------|--------|
| Identifiers | track_id |
| Text | artists, album_name, track_name, track_genre |
| Numeric | popularity, duration_ms, tempo, loudness |
| Boolean | explicit |
| Audio Metrics | danceability, energy, speechiness, acousticness, instrumentalness, liveness, valence |
| Musical Attributes | key, mode, time_signature |

---

## Data Quality Findings

### Missing & Invalid Values
- **51 rows** contain literal string values such as `#NAME?`
- These values exist in the raw dataset and are not spreadsheet formula errors
- Rows were **flagged for review only**, not deleted

### Duplicates
- Approximately **40,900 duplicate `track_id` values** identified
- Duplicate handling is deferred to Week 3
- Further investigation needed to determine if duplicates represent:
  - Multi-genre classification
  - Re-releases or remasters
  - Data ingestion artifacts

### Unicode & Special Characters
- Artist and album names include Unicode (e.g., Japanese characters)
- These values are considered valid and preserved
- No normalization (e.g., PROPER casing) applied

---

## Key Observations
- No primary key exists in the raw dataset
- Genre values are not normalized
- Multiple artists may exist within a single field
- Popularity values range from 0–100 as expected

---

## Actions Deferred to Week 3
- Removal of missing or invalid rows
- Duplicate resolution strategy
- Dimension and fact table creation
- Surrogate key generation

---

## Conclusion
Week 2 establishes a documented understanding of the raw dataset’s structure and quality.
All transformation logic will be applied in subsequent stages after profiling is complete.
