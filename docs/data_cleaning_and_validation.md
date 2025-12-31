# Data Cleaning and Validation

## Purpose

This document describes the data cleaning, validation, and preparation steps
performed to transform the raw music metadata into an analysis-ready dataset.

The focus of this phase was **data integrity and correctness**, not aggressive
row reduction. All decisions were guided by business context and downstream
analytics requirements.

---

## Input Dataset

- Source: Public Spotify Tracks dataset (used to simulate Qobuz metadata)
- Format: CSV
- Scale: ~114,000 rows, 20 core fields
- Raw data was preserved and never modified directly

A working copy was used to apply all cleaning logic.

---

## Cleaning Principles

Before applying any changes, the following principles were established:

1. Raw data must remain intact and auditable
2. Cleaning steps must be explicit and explainable
3. Repeated identifiers do not automatically imply duplicate records
4. Valid business variations must be preserved
5. Temporary helper logic should not appear in final outputs

---

## Handling Invalid and Missing Records

### Observation

During profiling, a small number of rows were found to contain literal invalid
string values (e.g., `#NAME?`) in critical identifier fields such as:
- track identifiers
- artist names
- album names

These values were part of the source data and were not spreadsheet errors.

### Decision

Because these records:
- Could not be reliably interpreted
- Would break joins and aggregations
- Represented a negligible fraction of the dataset

They were removed from the working dataset.

### Outcome

- Approximately 50 invalid rows removed
- No meaningful impact on analytical coverage

---

## Duplicate Investigation

### Initial Findings

A simple identifier-based check revealed many repeated `track_id` values.
However, deeper inspection showed that repeated identifiers often represented
valid business scenarios, including:
- Multi-genre classification
- Compilation albums
- Contextual reuse of tracks

### Key Insight

> A repeated track identifier does **not** necessarily represent a duplicate record.

Therefore, deduplication could not be performed based on a single column.

---

## Business-Level Deduplication Validation

### Deduplication Criteria

A record would be considered a true duplicate **only if all business attributes matched**, including:
- track identifier
- track name
- album name
- artist(s)
- genre

Helper logic was used during investigation to simulate composite deduplication
rules typically implemented in SQL or Python.

### Validation Result

When evaluated across business-relevant attributes:
- No fully identical records were found
- Repeated identifiers consistently represented valid contextual differences

### Decision

No rows were removed for duplication.

This was a **deliberate and validated outcome**, not a failure to deduplicate.

---

## Text Standardization

To improve consistency while preserving meaning:

- Leading and trailing whitespace was removed from text fields
- Cleaned versions of artist, album, and genre fields were created

### Explicit Non-Actions

- No case normalization (e.g., upper/lower/proper case)
- No Unicode removal or transformation

Non-English metadata (e.g., Japanese text) was treated as valid and preserved.

---

## Final Dataset Preparation

After completing all validation and cleaning steps:

- Temporary helper columns were removed
- Only business-relevant fields were retained
- All values were materialized (no formulas)

The final dataset was exported as:

cleaned_data/tracks_cleaned.csv


---

## Final Dataset Summary

- Rows retained: ~113,950
- Rows removed:
  - Invalid records: ~50
  - Duplicate records: 0
- All valid business variations preserved
- Dataset is ready for:
  - dimensional modeling
  - relational storage
  - analytical dashboards

---

## Key Takeaways

- Data cleaning prioritizes correctness over row reduction
- Duplicate detection must be guided by business context
- Investigation is as important as deletion
- Temporary logic should never leak into final datasets

This process produced a **trustworthy, analysis-ready dataset** suitable for
downstream analytics and reporting.
