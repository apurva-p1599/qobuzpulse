# Data Dictionary (Version 1)

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
