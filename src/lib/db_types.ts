export type ProjectFolder = {
  id: number & { __brand: "project_folder" };
  name: string;
  children: (ProjectFolder | Project)[];
};

export type Project = ProjectMetadata & {
  tags: LotusLabTag[];
  lists: List[];
};

export type ProjectMetadata = {
  id: number & { __brand: "project" };
  id_search: string; // can be set by user, this is what they can query for
  name: string;
  format: ProjectFormat;
  author: string;
  created_at: Date;
  updated_at: string;

  description?: string;
  primer?: string;
};

export const project_format_options = [
  "list",
  "cube",
  "standard",
  "modern",
  "legacy",
  "vintage",
  "pauper",
  "commander",
] as const;
export type ProjectFormat = (typeof project_format_options)[number];

export type List = ListMetadata & {
  tags: LotusLabTag[];
  cards: ListCard[];
};

export type ListMetadata = {
  id: number & { __brand: "list" };
  name: string;
  created_at: string;
  updated_at: string;
  description?: string;
};

export type ListCard = {
  id: number & { __brand: "list_card" };
  card: LotusLabCard;
  notes?: string;
  tags: LotusLabTag[];
};

export type LotusLabCard = CardCore &
  CardPrinting & {
    core: {
      notes?: string;
      tags?: LotusLabTag[];
    };
    printing: {
      notes?: string;
      is_favorite_printing?: boolean;
      tags?: LotusLabTag[];
    };
  };

export type LotusLabTag = {
  tag: string;
  color: string;
};

export type CardCore = {
  // identifiers
  id_core: number & { __brand: "card_core" }; // different from id_printing
  id_scryfall_oracle: string;
  name: string;
  name_ascii?: string;
  name_face?: string;

  // gameplay fields
  defense?: string; // battles
  hand_modifier?: number; // vanguards. text on the db, parse to signed number
  has_alternative_deck_limit: boolean;
  keywords: string[];
  life_modifier?: string; // vanguards
  loyalty?: string; // plansewalkers. can be non-number like 'X'
  mana_cost?: string;
  mana_value: number;
  mana_value_face?: number;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  type_line: string;
  types: CardType[];
  color: ColorFlags;
  color_id: ColorFlags;
  color_indicator: ColorFlags;
  produces: ProducesColorFlags;

  // other fields
  attraction_lights: number[];
  face_side?: string;
  is_funny: boolean;
  is_game_changer: boolean;
  is_reprint: boolean;
  is_reserved: boolean;
  layout: CardLayout;
  leadership_skills: CardLeadershipSkill[];
  legalities: CardLegality[];
  rank_edhrec?: number;
  rank_edhrec_salt?: number;
  rank_pennydreadful?: number;
  released_at: string;
  rulings: CardRuling[];
  tags_tagger_oracle: string[];

  // related cards
  face_core_ids: (number & { __brand: "card_core" })[];
  spellbook_core_ids: (number & { __brand: "card_core" })[];
  token_ids: {
    quantity: number;
    id_token_core: number & { __brand: "card_core" };
  }[];
};

// Utility types for color handling
export type ColorFlags = {
  white: boolean;
  blue: boolean;
  black: boolean;
  red: boolean;
  green: boolean;
  count: number;
};

export type ProducesColorFlags = ColorFlags & {
  colorless: boolean;
};

export type CardLayout =
  | "normal"
  | "split"
  | "flip"
  | "transform"
  | "modal_dfc"
  | "meld"
  | "leveler"
  | "class"
  | "case"
  | "saga"
  | "adventure"
  | "mutate"
  | "prototype"
  | "battle"
  | "planar"
  | "scheme"
  | "vanguard"
  | "token"
  | "double_faced_token"
  | "emblem"
  | "augment"
  | "host"
  | "art_series"
  | "reversible_card";

export type CardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "mythic"
  | "special"
  | "bonus";

export type CardType = {
  kind: "super" | "card" | "sub";
  type: string;
};

export type CardLegality = {
  format: string;
  legality: string;
};

export type CardRuling = {
  source: "wotc" | "scryfall";
  published_at: string;
  text: string;
};

export type CardPrinting = {
  // identifiers
  id_printing: number & { __brand: "card_printing" }; // different from id_core
  id_mtgarena?: string;
  id_mtgjson_uuid?: string;
  id_mtgo?: string;
  id_multiverse?: string;
  id_scryfall?: string;
  id_scryfall_illustration?: string;

  // printing details
  artists: Artist[];
  availability: CardAvailability[];
  border_color: CardBorderColor;
  finishes: CardFinish[];
  flavor_name?: string;
  flavor_text?: string;
  flavor_text_face?: string;
  frame_effects: CardFrameEffect[];
  frame_version: CardFrameVersion;
  has_content_warning: boolean;
  is_full_art: boolean;
  is_online_only: boolean;
  is_oversized: boolean;
  is_printed_in_booster: boolean;
  is_printed_in_deck: boolean;
  is_promo: boolean;
  is_story_spotlight: boolean;
  is_textless: boolean;
  language?: string;
  oracle_text_original?: string;
  promo_types: CardPromoType[];
  rarity: CardRarity;
  security_stamp?: string;
  set: Set;
  signature?: string;
  tags_tagger_art: string[];
  tags_tagger_printing: string[];
  types_original: CardType[];
  type_line_original?: string;
  watermark?: string;

  // related cards
  face_ids: (number & { __brand: "card_printing" })[];
  rebalanced_ids: (number & { __brand: "card_printing" })[];
  variation_ids: (number & { __brand: "card_printing" })[];
  token_ids: {
    quantity: number;
    id_token_printing: number & { __brand: "card_printing" };
  }[];
};

// Additional types for card printing
export type CardBorderColor =
  | "black"
  | "white"
  | "borderless"
  | "yellow"
  | "silver"
  | "gold";

export type CardFrameVersion = "1993" | "1997" | "2003" | "2015" | "future";

export type CardFinish = "foil" | "nonfoil" | "etched";

export type CardAvailability =
  | "arena"
  | "dreamcast"
  | "mtgo"
  | "paper"
  | "shandalar";

export type CardFrameEffect =
  | "legendary"
  | "miracle"
  | "enchantment"
  | "draft"
  | "devoid"
  | "tombstone"
  | "colorshifted"
  | "inverted"
  | "sunmoondfc"
  | "compasslanddfc"
  | "originpwdfc"
  | "mooneldrazidfc"
  | "waxingandwaningmoomdfc"
  | "showcase"
  | "extendedart"
  | "companion"
  | "etched"
  | "snow"
  | "lesson"
  | "shatteredglass"
  | "convertdfc"
  | "fandfc"
  | "upsidedowndfc"
  | "spree";

// this one is probably too much to type, they make a new promo type every set.
export type CardPromoType = string;

export type CardLeadershipSkill = {
  can_lead: "commander" | "oathbreaker" | "brawl";
};

// Artist type
export type Artist = {
  id: string & { __brand: "artist" };
  name: string;
};

// Set type
export type Set = {
  id: string & { __brand: "set" };
  code: string;
  name: string;
  type: string;
};
