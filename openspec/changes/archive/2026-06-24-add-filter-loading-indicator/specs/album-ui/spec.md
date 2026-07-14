## MODIFIED Requirements

### Requirement: Loading and error states

The UI SHALL display loading indicators while fetching data and error messages when API calls fail.

#### Scenario: Loading state

- **WHEN** sticker data is being fetched
- **THEN** a loading indicator is shown

#### Scenario: Loading state during filter or search refetch

- **WHEN** a user changes a filter chip or search query and sticker data is being refetched
- **THEN** a loading indicator is shown inside the search input

#### Scenario: API error

- **WHEN** the API returns an error
- **THEN** an error message is displayed to the user
