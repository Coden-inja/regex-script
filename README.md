# regex-script

Cleans real estate listing descriptions (raw `frontend_overview` text) into TTS-ready spoken text for AI voiceover generation. Converts addresses, numbers, years, dimensions, fractions, currency, acronyms and abbreviations into natural spoken phrasing, then truncates to a voiceover-friendly length and writes the result back to the database.

## Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root (this file is gitignored — do not commit it):

```env
DATABASE_HOST=your_db_host
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=your_db_name
DATABASE_PORT=3306
```

## Run

### Auto mode (for newly incoming listings)

Cleans every published property that doesn't already have a `tts_clean_overview` yet (i.e., new listings only). No IDs needed — safe to re-run anytime as a cron job:

```bash
npm run pipeline
```

### Targeted / reviewed mode (spot-check specific listings)

Clean only specific property IDs, e.g. after changing rules in `text_sanitizer.js`:

```bash
npm run pipeline --reviewed 462 683 3667
```

### Verbose output

Prints full side-by-side raw/cleaned text to the console (not just word counts):

```bash
npm run pipeline --verbose
```

### Backfill / populate (legacy one-shot)

Backfills `tts_clean_overview` for previously published rows missing it:

```bash
npm run populate
```

Every run writes a detailed log to `pipeline_run.log` (row-by-row raw vs. cleaned vs. final text, plus run metrics).

## Database

Table: `properties`

| Column | Direction | Purpose |
| :--- | :--- | :--- |
| `id` | read | row identifier / selection |
| `is_published` | read (filter) | only published listings are processed |
| `frontend_overview` | read | raw listing description to clean |
| `tts_clean_overview` | write | cleaned, truncated plain text ready for TTS |
| `tts_clean_overview_html` | write | same text with highlighted converted tokens (for review/validation) |

## How it works

`run_pipeline.js` reads rows, runs each `frontend_overview` through `text_sanitizer.js`, and writes the results back in batches of 50 with DB transactions.

`text_sanitizer.js` (`cleanTextForTTS` / `cleanAndTruncateTTS`) runs a staged regex pipeline:

1. Unicode/quote/multiplication-symbol normalization and parenthetical stripping
2. Boilerplate, title-case and ALL-CAPS heading removal
3. Transit/compass expansion (subway lines, A/C, W/D, E/W/N/S directions)
4. Address house-number spoken conversion (e.g. `155 East 49th Street` -> `one fifty-five East forty-ninth Street`)
5. Dimensions, feet-inches, fractions and square footage expansion
6. Acronym/abbreviation and brand-name pronunciation rules
7. Number, currency, year, ordinal and decimal conversion, then punctuation/spacing/capitalization cleanup

Text is then truncated to ~150 words at the nearest sentence boundary (words over 150, up to a 172-word window). Empty/null rows are left untouched.