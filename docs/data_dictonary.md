# Data Dictionary

This document describes the structure, meaning, and usage of fields in the
QobuzPulse music analytics dataset. The dataset represents track-level metadata
used for analysis, modeling, and dashboard development.

---

## Dataset Overview

- Domain: Music streaming analytics
- Granularity: One row per track per contextual classification (e.g., genre)
- Source: Public Spotify Tracks dataset (used to simulate Qobuz metadata)
- Format: CSV (`cleaned_data/tracks_cleaned.csv`)

Notes:
- Track identifiers are not guaranteed to be unique.
- A single track may legitimately appear multiple times under different genres
  or album contexts.
- The dataset is intended for analytical use, not transactional updates.

---

## Track-Level Dataset Fields

The following fields are present in the cleaned analytics dataset.

### Core Identifiers & Metadata

| Column Name | Description | Data Type | Example |
|------------|------------|-----------|---------|
| track_id | Platform-specific identifier for a track | Text | 4iV5W9uYEdYUVa79Axb7Rh |
| track_name | Name of the track | Text | Snow (Hey Oh) |
| artists | Artist or group associated with the track | Text | Red Hot Chili Peppers |
| album_name | Album in which the track appears | Text | Stadium Arcadium |
| track_genre | Original genre classification | Text | alt-rock |

---

### Standardized Text Fields

These fields are standardized versions of source text fields and are preferred
for analysis and modeling.

| Column Name | Description | Data Type | Example |
|------------|------------|-----------|---------|
| artist_clean | Trimmed artist name for consistency | Text | Red Hot Chili Peppers |
| album_clean | Trimmed album name for consistency | Text | Stadium Arcadium |
| track_genre_clean | Trimmed genre value used in analysis | Text | alt-rock |

---

### Popularity & Duration

| Column Name | Description | Data Type | Example |
|------------|------------|-----------|---------|
| popularity | Popularity score assigned by the platform | Integer | 75 |
| duration_ms | Track duration in milliseconds | Integer | 210000 |
| explicit | Indicates explicit content | Boolean | false |

---

### Audio Features

| Column Name | Description | Data Type | Valid Range / Example |
|------------|------------|-----------|----------------------|
| danceability | Suitability of a track for dancing | Float | 0.0 – 1.0 |
| energy | Intensity and activity measure | Float | 0.0 – 1.0 |
| key | Musical key of the track | Integer | 0 – 11 |
| loudness | Overall loudness in decibels (dB) | Float | -5.2 |
| mode | Modality: major (1) or minor (0) | Integer | 0 / 1 |
| speechiness | Presence of spoken words | Float | 0.0 – 1.0 |
| acousticness | Likelihood of acoustic performance | Float | 0.0 – 1.0 |
| instrumentalness | Likelihood of instrumental content | Float | 0.0 – 1.0 |
| liveness | Presence of live audience | Float | 0.0 – 1.0 |
| valence | Musical positivity | Float | 0.0 – 1.0 |
| tempo | Estimated tempo (BPM) | Float | 120.5 |
| time_signature | Estimated beats per bar | Integer | 3 – 7 |

---

## Data Quality & Design Notes

- A small number of records containing invalid literal values in critical
  identifiers were removed during cleaning.
- Repeated `track_id` values are expected and intentional.
- No records were removed solely due to repeated identifiers.
- Multi-genre classification is preserved.
- Non-English and Unicode text values are treated as valid.
- Temporary processing and validation fields are excluded from this dictionary.

---

## Modeling Notes (Forward-Looking)

The dataset is designed to support dimensional modeling.

Planned analytical structures include:
- A track-level fact table
- Artist, album, and genre dimensions
- Surrogate keys generated during relational modeling

These structures are not materialized in the dataset itself and are documented
here for design context only.
