# Data Layers Design

## Raw Layer
The raw layer contains the Spotify dataset exactly as downloaded from the source,
without any modifications. This layer preserves the original data for traceability
and auditing.

Location:
- raw_data/spotify/dataset.csv

## Clean Layer
The clean layer will store data after applying data quality checks such as
handling missing values, removing duplicates, and standardizing text fields.
This layer prepares the data for analytical modeling.

## Curated Layer
The curated layer contains analytics-ready tables designed using a star schema.
Surrogate keys are generated for dimensions, and the data is optimized for
reporting and visualization in Power BI.
