# Star Schema Design

The data model is designed as a star schema with a central fact table representing
track-level metrics and surrounding dimension tables providing descriptive context.

## Fact Table
fact_tracks stores one row per track and contains measurable attributes such as
popularity, duration, and audio features.

## Dimension Tables
- dim_artist: artist details derived from the artists field
- dim_album: album details derived from album_name
- dim_genre: genre classifications derived from track_genre

Each dimension has a one-to-many relationship with the fact table, enabling
efficient slicing and filtering in BI tools such as Power BI.
