# Data Structure Planning

## sqlite tables
- cards: all cards source of truth from scryfall with extra global fields
- projects
  - project level metadata
    - name
    - description
    - primer
    - created_at timestamp
  - relationship with lists
- lists
  - list level metadata
    - name
    - description
    - created_at timestamp
  - relationship with projects
  - relationship with cards_in_lists
- cards_in_lists
  - metadata for cards in each list
    - quantity
    - notes
  - relationship with cards
  - relationship with lists

how do we handle custom cards?

## version control
use git which means individual data points should be on a single line in a text file to make parsing of diffs easier.
- folder for each project/
  - file for metadata (tsv)
  - files for primers and other markdown (md)
  - folder for each list/
    - files for metadata nad markdown
    - file for cards (tsv)
      - line for each card
