create table if not exists project_folders (
    id          integer primary key autoincrement,
    name        text not null,
    id_parent   integer references project_folders(id),
);

create table if not exists projects (
    id                  integer primary key autoincrement,
    id_search           text unique,
    id_folder_parent    integer references project_folders(id),
    name                text not null,
    format              text not null,
    author              text not null,
    created_at          text not null default (datetime('now')),
    updated_at          text not null default (datetime('now')),

    description         text,
    primer              text,
);

create table if not exists project_tags (
    id_project  integer not null references projects(id) on delete cascade,
    name        text not null,
    color       text,
);

create table if not exists lists (
    id          integer primary key autoincrement,
    id_project  integer not null references projects(id) on delete cascade,
    name        text not null,
    created_at  text not null default (datetime('now')),
    updated_at  text not null default (datetime('now')),
    description text,
);

create table if not exists list_tags (
    id_list integer not null references lists(id) on delete cascade,
    name    text not null,
    color   text,
);

create table if not exists list_cards (
    id          integer primary key autoincrement,
    id_project  integer not null references projects(id) on delete cascade,
    id_list     integer not null references lists(id) on delete cascade,
    id_card     text not null references cards(id) on delete cascade,
    notes       text,
);

create table if not exists list_card_tags (
    id_list_card    integer not null references list_cards(id) on delete cascade,
    name            text not null,
    color           text,
);

create table if not exists cards_core (
    -- identifiers
    id                          integer primary key autoincrement,
    id_scryfall_oracle          text,
    name                        text not null,
    name_ascii                  text,
    name_face                   text,

    -- gameplay fields
    defense                     text, -- battles
    hand_modifier               text, -- vanguards
    has_alternative_deck_limit  boolean not null default 0,
    life_modifier               text, -- vanguards
    loyalty                     text, -- planeswalkers
    mana_cost                   text,
    mana_value                  float not null,
    mana_value_face             float,
    oracle_text                 text,
    power                       text,
    toughness                   text,
    type_line                   text not null,

    -- colors
    is_color_white              boolean not null default 0,
    is_color_blue               boolean not null default 0,
    is_color_black              boolean not null default 0,
    is_color_red                boolean not null default 0,
    is_color_green              boolean not null default 0,
    color_count                 integer not null default 0,

    is_colorid_white            boolean not null default 0,
    is_colorid_blue             boolean not null default 0,
    is_colorid_black            boolean not null default 0,
    is_colorid_red              boolean not null default 0,
    is_colorid_green            boolean not null default 0,
    colorid_count               integer not null default 0,

    is_colorindicator_white     boolean not null default 0,
    is_colorindicator_blue      boolean not null default 0,
    is_colorindicator_black     boolean not null default 0,
    is_colorindicator_red       boolean not null default 0,
    is_colorindicator_green     boolean not null default 0,
    colorindicator_count        integer not null default 0,

    produces_white              boolean not null default 0,
    produces_blue               boolean not null default 0,
    produces_black              boolean not null default 0,
    produces_red                boolean not null default 0,
    produces_green              boolean not null default 0,
    produces_colorless          boolean not null default 0,
    produces_count              integer not null default 0,

    -- other
    face_side                   text,
    is_funny                    boolean not null default 0,
    is_game_changer             boolean not null default 0,
    is_reprint                  boolean not null default 0,
    is_reserved                 boolean not null default 0,
    layout                      text not null,
    rank_edhrec                 integer,
    rank_edhrec_salt            integer,
    rank_pennydreadful          integer,
    released_at                 text not null,

    -- lotuslab fields
    notes                       text,
);

create table if not exists card_types (
    id_core     integer not null references cards_core(id) on delete cascade,
    kind        text, -- super | card | sub
    type        text,
);

create table if not exists card_legalities (
    id_core         integer not null references cards_core(id) on delete cascade,
    format          text not null,
    legality        text not null,
);

-- TODO: check if mtgjson has any rulings that scryfall doesn't
create table if not exists card_rulings (
    id_core         integer not null references cards_core(id) on delete cascade,
    source          text not null, -- wotc | scryfall
    published_at    text not null,
    text            text not null,
);

create table if not exists card_keywords (
    id_core         integer not null references cards_core(id) on delete cascade,
    keyword         text not null,
);

create table if not exists card_leadership_skills (
    id_core         integer not null references cards_core(id) on delete cascade,
    can_lead        text, -- commander, oathbreaker, brawl
);

create table if not exists card_attraction_lights (
    id_core     integer not null references cards_core(id) on delete cascade,
    light       integer not null,
);

-- user created
create table if not exists card_tags (
    id_core     integer not null references cards_core(id) on delete cascade,
    tag         text not null,
    color       text not null,
);

-- scryfall tagger project
create table if not exists card_tags_oracle (
    id_core     integer not null references cards_core(id) on delete cascade,
    tag         text not null,
);

create table if not exists card_face_ids (
    id_core     integer not null references cards_core(id) on delete cascade,
    id_face     integer not null references cards_core(id),
);

create table if not exists card_token_ids (
    id_core     integer not null references cards_core(id) on delete cascade,
    id_token    integer not null references cards_core(id),
    quantity    integer not null default 1,
);

-- for now, any conjurable card goes here
create table if not exists card_spellbook (
    id_core     integer not null references cards_core(id) on delete cascade,
    id_card     integer not null references cards_core(id),
);

create table if not exists card_printings (
    -- identifiers
    id                          integer primary key autoincrement,
    id_core                     integer not null references cards_core(id) on delete cascade,
    id_mtgarena                 text,
    id_mtgjson_uuid             text,
    id_mtgo                     text,
    id_multiverse               text,
    id_scryfall                 text,
    id_scryfall_illustration    text,

    border_color                text not null, -- black | white | borderless | yellow | silver | gold
    flavor_name                 text, -- nickname
    flavor_text                 text,
    flavor_text_face            text,
    frame_version               text not null, -- 1993 | 1997 | 2003 | 2015 | future
    has_content_warning         boolean not null default 0,
    is_full_art                 boolean not null default 0,
    is_online_only              boolean not null default 0,
    is_oversized                boolean not null default 0,
    is_printed_in_booster       boolean not null default 0,
    is_printed_in_deck          boolean not null default 0,
    is_promo                    boolean not null default 0,
    is_story_spotlight          boolean not null default 0,
    is_textless                 boolean not null default 0,
    language                    text,
    oracle_text_original        text,
    rarity                      text not null, -- common | uncommon | rare | special | mythic | bonus
    security_stamp              text,
    set_id                      text not null references sets(id),
    signature                   text,
    type_line_original          text,
    watermark                   text,

    -- lotuslab fields
    notes                       text,
    is_favorite_printing        boolean not null default 0,
);

create table if not exists card_printing_types (
    id_printing     integer not null references card_printings(id) on delete cascade,
    kind            text, -- one of [super, card, sub]
    type_original   text,
);

create table if not exists card_printing_artists (
    id_printing     integer not null references card_printings(id) on delete cascade,
    id_artist       text not null references artists(id),
);

create table if not exists card_printing_finishes (
    id_printing     integer not null references card_printings(id) on delete cascade,
    finish          text, -- foil | nonfoil | etched
);

create table if not exists card_printing_availability (
    id_printing     integer not null references card_printings(id) on delete cascade,
    game            text, -- arena | dreamcast | mtgo | paper | shandalar
);

create table if not exists card_printing_face_ids (
    id_printing         integer not null references card_printings(id) on delete cascade,
    id_printing_face    integer not null references card_printings(id)
);

-- user created
create table if not exists card_printing_tags (
    id_printing     integer not null references card_printings(id) on delete cascade,
    tag             text not null,
    color           text not null,
);

-- scryfall tagger project
create table if not exists card_printing_tags_art (
    id_printing     integer not null references card_printings(id) on delete cascade,
    tag             text not null,
);

-- scryfall tagger project
create table if not exists card_printing_tags_printing (
    id_printing     integer not null references card_printings(id) on delete cascade,
    tag             text not null,
);

create table if not exists card_printing_rebalanced_ids (
    id_printing     integer not null references card_printings(id) on delete cascade,
    id_rebalanced   integer not null references card_printings(id),
);

create table if not exists card_printing_frame_effect (
    id_printing     integer not null references card_printings(id) on delete cascade,
    effect          text,
);

create table if not exists card_printing_promo_types (
    id_printing     integer not null references card_printings(id) on delete cascade,
    type            text,
);

create table if not exists card_printing_translations (
    id_printing     integer not null references card_printings(id) on delete cascade,

);

create table if not exists artists (
    id      text unique not null, -- from scryfall
    name    text not null,
);

create table if not exists sets (
    id      text unique not null, -- from scryfall
    code    text unique not null,
    name    text not null,
    type    text not null
);
