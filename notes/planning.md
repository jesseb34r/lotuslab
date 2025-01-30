# Top Level Project Plan

## Goals for this project

- offline cube (and other card list) editor
- feels like an application -- think excel but for magic
- practice using tauri and rust

## Features

### Future log

- custom cards and modifications
- mobile app interface
- online capabilities?
  - view and share cubes
- notes per card and per cube (primer etc)
- documentation (local and online)
- support for collection tracking (separate tool?)
- prices?
- upload decks associated with cubes
- battlebox style collection of decks
- sort cards by printed year

### Local database of cards

- syncs with scryfall on some consistent basis
- images maybe only stored for cards that are actively in decks?
- maybe have options for which bulk set to store or how much to download offline. Probably could have a light layer that just queries scryfall and stores a minimum amount, could be useful for mobile in the future as well
- FUTURE: custom card support

### Import existing list from text file

- csv from cubecobra and cubeartisan (and other export formats from them?)
- text list with various formats

### Save cubes in either plain text or in database

- think about standard for cube list storage
- think about version control paradigms -- this probably means database is necessary with export to plain text

### Version control

- some git-like features
  - edits as commits with optional message
  - branches
  - clones from hosted url (allow importing from url instead of file)
- visual interface for viewing version tree with branches and merges etc
- export changelog as markdown (usecase: sharing to cubecobra/artisan/riptide blog)

### Filter and sort lists

- scryfall syntax at minimum
- more intuitive than cubecobra

### Functionality expected of desktop editors

- hot keys for things
- custom context menus
- performant

## Design conversations

### Terminology

- Top level project/list
  - Project
  - List
  - Cube/Deck/Collection
- Sub lists
  - Module
  - Board
  - sublist

#### Questions

- Opinionated vs composable
- How do I handle notes/primers?
- How big is the difference between a cube and a deck?
  - Is it just the filter and view presets or are there bigger structural differences?
  - How do collections fit in?

#### Thoughts

- I want this app to be able to be used for
  - small 1-dimension lists of cards
  - decks
  - cubes (this is my main focus rn I think)
  - collections (different as it influences other lists potentially)
- terminology affects
  - high level thought structure of design and use
  - file menus
  - layout of editor

## TODO

- [ ] initial visual interface
  - [ ] default sorted with no options to start
  - [ ] loads images and card data (from local to start)
  - [ ] pick card data source for importing lists
  - [ ] allow editing list in plain text in the app
  - [ ] save list to plain text
- [ ] initial card database
  - [ ] libsql or other database implementation
  - [ ] scryfall api stuff
  - [ ] initial list format/type/table
