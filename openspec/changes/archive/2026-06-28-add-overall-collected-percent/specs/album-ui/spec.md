## MODIFIED Requirements

### Requirement: Progress display

The UI SHALL display album progress as `owned / total (percentage%)` with a visual progress indicator at the top of the list.

#### Scenario: Progress updates on count change

- **WHEN** a user increments a sticker from 0 to 1
- **THEN** the progress owned count and displayed percentage increase accordingly

#### Scenario: Overall progress shows percentage

- **WHEN** collection progress is loaded (e.g. owned `142`, total `990`, percentage `14`)
- **THEN** the progress stats line displays `142 / 990 (14%)`

#### Scenario: Overall progress unavailable

- **WHEN** collection progress is not yet loaded or unavailable
- **THEN** the progress stats line displays `— / 990 (—%)` and the progress bar shows zero fill
