# Moxcel
An offline app for editing and maintaining lists of Magic the Gathering cards.

## Project Goals
- Local-first, cross platform application. Think Excel but for magic cards.
- Prioritize editing and maintaining experience, functionality outside of this scope should be achieved by interfacing with other tools (unix philosophy).
- Users should own their data completely. Use a plain text file for list storage and prioritize interfacing with common file formats such as cardname decklists and cubecobra-style csvs.

## Roadmap to 0.1.0 Alpha
- [ ] All cards from default_cards in db
- [ ] Card search
- [ ] Import decklist file
- [ ] Save/Export decklist file
- [ ] Basic query and sort functionality within a list
- [ ] Basic project views (cube, deck, list, etc)
- [ ] Initial command palette implementation
- [ ] Decide on a better name than moxcel
- [x] Basic UI to view a list, use cube as default for sorting rn
- [x] Basic edits -- add + delete
  - start with typing card names, scryfall search later
- [x] Hovering a card fetches the image from scryfalld

## 1.0/Beta Feature Goals
- Offline and Local First
  - app on every platform (eventually including mobile)
  - local cache of images to enable fully offline experience
  - sync can be achieved through background server updates eventually, initially users can use their own file sync to enable this (github, icloud, google drive, etc)
- Version Control
  - git backed
  - good user story for describing changes
  - interface with CubeCobra so that changes/blogs show changes in Moxcel
  - good fork/merge/rebase UI
- List comparison
- scryfall-compatible search
- active project context that you can access from any card/search/comparison
- Supported File Types
  - common list file types
    - card name deck list (with or without versions and quantities)
    - cubecobra csv
    - [ ] talk to Anthony Mattox about stuff from his list formatter tool
  - custom structured list file type
    - probably json
    - maybe some csv thing can be a basic representation
- Interface with online tools
  - CubeCobra
  - Draftmancer
  - Moxfield and other deckbuilding sites

## Contributing
prerequisites:
- git
- bun
- rust

fork this repo and contribute through PRs

in the project root:
```bash
bun install
bun tauri dev
```
