-- Initial tables and indexes

-- cards table: source of truth for card data
create table if not exists cards (
    -- Scryfall core card fields
    id                  text primary key,
    layout              text not null, -- type layout with options?
    oracle_id           text,
    scryfall_uri        text not null,

    -- Scryfall gameplay fields
    -- all_parts // needs typing
    -- card_faces // needs typing
    cmc                 real not null default 0,

    -- split coloridentity array into individual values
    cid_white           integer not null default 0,
    cid_blue            integer not null default 0,
    cid_black           integer not null default 0,
    cid_red             integer not null default 0,
    cid_green           integer not null default 0,
    cid_count           integer not null default 0,
    -- split colors array into individual values
    is_white            integer not null default 0,
    is_blue             integer not null default 0,
    is_black            integer not null default 0,
    is_red              integer not null default 0,
    is_green            integer not null default 0,
    color_count         integer not null default 0,

    defense             text,
    hand_modifier       text,
    -- keywords         // needs typing
    -- legalities       // needs typing
    loyalty             text,
    mana_cost           text,
    name                text,
    oracle_text         text,
    power               text,
    -- produced_mana    // needs typing like colors
    reserved            integer not null default 0,
    toughness           text,
    type_line           text,

    -- Scryfall print fields
    artist              text,
    -- artist_ids       // needs typing
    -- attraction_light?
    booster             integer not null default 0,
    card_back_id        text,
    collector_number    text,
    content_warning     integer not null default 0,
    digital             integer not null default 0,
    -- finishes         // needs typing
    flavor_name         text,
    flavor_text         text,
    -- frame_effects    // needs typing
    full_art            integer not null default 0,
    -- games            // needs typing
    image_uri           text, -- only use 'normal' image. eventually cache
    oversized           integer not null default 0,
    promo               integer not null default 0,
    rarity              text, -- type with options?
    released_at         text,
    reprint             integer not null default 0,
    set_name            text,
    set_type            text,
    set_code            text,
    story_spotlight     integer not null default 0,
    textless            integer not null default 0,
    variation           integer not null default 0,
    variation_of        text
    -- preview stats?

    -- Moxcel fields?
);

-- projects table
create table if not exists projects (
    id          integer primary key autoincrement,
    name        text not null unique,
    description text,
    primer      text
);

-- lists table
create table if not exists lists (
    id          integer primary key autoincrement,
    project_id  integer not null,
    name        text not null,
    description text,
    foreign key (project_id) references projects(id) on delete cascade,
    unique(project_id, name)
);

-- cards in lists: card level metadata within each list
create table if not exists cards_in_lists (
    id          integer primary key autoincrement,
    list_id     integer not null,
    card_id     text not null,
    notes       text,
    foreign key (list_id) references lists(id) on delete cascade,
    foreign key (card_id) references cards(id) on delete cascade
);

create index idx_cards_name on cards(name);
