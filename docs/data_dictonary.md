# Data Dictionary (Version 1)

# Week 1

## Table: fact_tracks
| Field name | Description | Source | Sample values |
|----------|------------|--------|---------------|
| track_id | Unique identifier for each track | track_id | 4iV5W9uYEdYUVa79Axb7Rh |
| popularity | Popularity score of the track | popularity | 75 |
| duration_ms | Duration in milliseconds | duration_ms | 210000 |
| danceability | Danceability score | danceability | 0.81 |

## Table: dim_artist
| Field name | Description | Source | Sample values |
|----------|------------|--------|---------------|
| artist_id | Surrogate key for artist | artists | 1 |
| artist_name | Name of the artist | artists | Drake |

## Table: dim_album
| Field name | Description | Source | Sample values |
|----------|------------|--------|---------------|
| album_id | Surrogate key for album | album_name | 10 |
| album_name | Name of the album | album_name | Scorpion |

## Table: dim_genre
| Field name | Description | Source | Sample values |
|----------|------------|--------|---------------|
| genre_id | Surrogate key for genre | track_genre | 3 |
| genre_name | Genre name | track_genre | hip hop |

# Data Dictionary – Raw Dataset (Week 2)

This dictionary describes the raw dataset as received.
Values are documented as-is without enforcing constraints or transformations.

---

| Field Name | Description | Data Type | Source | Notes |
|----------|------------|----------|--------|------|
| track_id | Unique identifier for a track | Text | Spotify Dataset | Contains duplicates |
| artists | Name(s) of artist(s) | Text | Spotify Dataset | Unicode values present |
| album_name | Album title | Text | Spotify Dataset | Some missing values |
| track_name | Track title | Text | Spotify Dataset | Trimmed for whitespace only |
| popularity | Popularity score (0–100) | Numeric | Spotify Dataset | Used for ranking |
| duration_ms | Track duration in milliseconds | Numeric | Spotify Dataset | No standardization applied |
| explicit | Explicit content flag | Boolean | Spotify Dataset | TRUE/FALSE |
| danceability | Danceability score | Numeric | Spotify Dataset | Range 0–1 |
| energy | Energy score | Numeric | Spotify Dataset | Range 0–1 |
| key | Musical key | Numeric | Spotify Dataset | 0–11 scale |
| loudness | Loudness in decibels | Numeric | Spotify Dataset | Negative values expected |
| mode | Major (1) / Minor (0) | Numeric | Spotify Dataset | Binary |
| speechiness | Speech presence | Numeric | Spotify Dataset | Range 0–1 |
| acousticness | Acoustic confidence | Numeric | Spotify Dataset | Range 0–1 |
| instrumentalness | Instrumental confidence | Numeric | Spotify Dataset | Range 0–1 |
| liveness | Live recording confidence | Numeric | Spotify Dataset | Range 0–1 |
| valence | Positivity score | Numeric | Spotify Dataset | Range 0–1 |
| tempo | Beats per minute | Numeric | Spotify Dataset | Wide range |
| time_signature | Time signature | Numeric | Spotify Dataset | Typically 3–7 |
| track_genre | Genre classification | Text | Spotify Dataset | Not normalized |

---

## Notes
- No constraints or validations enforced at this stage
- Dictionary reflects raw state only
- Cleaning and normalization planned for Week 3


