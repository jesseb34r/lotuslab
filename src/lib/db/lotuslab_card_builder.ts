import type { ScryfallCard } from "@scryfall/api-types";
import type {
  CardCore,
  CardLayout,
  CardLeadershipSkill,
  CardLegality,
  CardRuling,
  CardType,
  ColorFlags,
  LotusLabCard,
  ProducesColorFlags,
} from "./db_types";
import type {
  AllPrintingsFile,
  MTGJsonCardSet,
  MTGJsonLeadershipSkills,
  MTGJsonLegalities,
  MTGJsonRulings,
} from "./download_mtgjson";

async function build_core_from_mtgjson(
  card: MTGJsonCardSet,
): Promise<Partial<CardCore>> {
  return {
    id_scryfall_oracle: card.identifiers.scryfallOracleId || "",
    name: card.name,
    name_ascii: card.asciiName,
    name_face: card.faceName,
    defense: card.defense,
    hand_modifier: card.hand ? parseInt(card.hand) : undefined,
    has_alternative_deck_limit: card.hasAlternativeDeckLimit || false,
    keywords: card.keywords || [],
    life_modifier: card.life,
    loyalty: card.loyalty,
    mana_cost: card.manaCost,
    mana_value: card.manaValue,
    mana_value_face: card.faceManaValue,
    oracle_text: card.text,
    power: card.power,
    toughness: card.toughness,
    type_line: card.type,
    types: parse_types(card.supertypes, card.types, card.subtypes),
    color: parse_color_flags(card.colors),
    color_id: parse_color_flags(card.colorIdentity),
    color_indicator: parse_color_flags(card.colorIndicator || []),
    // produces: parse_produces_flags(card), // TODO needs scryfall
    attraction_lights: card.attractionLights || [],
    face_side: card.side,
    is_funny: card.isFunny || false,
    // is_game_changer: false, // TODO needs scryfall
    is_reprint: card.isReprint || false,
    is_reserved: card.isReserved || false,
    layout: card.layout as CardLayout,
    leadership_skills: parse_leadership_skills(
      card.leadershipSkills || {
        brawl: false,
        commander: false,
        oathbreaker: false,
      },
    ),
    legalities: parse_legalities(card.legalities),
    rank_edhrec: card.edhrecRank,
    rank_edhrec_salt: card.edhrecSaltiness,
    released_at: card.originalReleaseDate || "",
    // rulings: parse_rulings(card.rulings), // TODO needs scryfall
    // tags_tagger_oracle: [], // TODO needs scryfall
    // Related cards will be resolved later
    face_core_ids: [],
    spellbook_core_ids: [],
    token_ids: [],
  };
}

function parse_types(
  types_super: string[],
  types_card: string[],
  types_sub: string[],
): CardType[] {
  const types: CardType[] = [];

  for (const t of types_super) {
    types.push({ kind: "super", type: t });
  }

  for (const t of types_card) {
    types.push({ kind: "card", type: t });
  }

  for (const t of types_sub) {
    types.push({ kind: "sub", type: t });
  }

  return types;
}

function parse_color_flags(colors: string[]): ColorFlags {
  const color_map: Record<string, keyof Omit<ColorFlags, "count">> = {
    W: "white",
    U: "blue",
    B: "black",
    R: "red",
    G: "green",
  };

  const flags: ColorFlags = {
    white: false,
    blue: false,
    black: false,
    red: false,
    green: false,
    count: 0,
  };

  for (const c of colors) {
    const key = color_map[c];
    if (key) {
      flags[key] = true;
    }
  }

  flags.count =
    (flags.white ? 1 : 0) +
    (flags.blue ? 1 : 0) +
    (flags.black ? 1 : 0) +
    (flags.red ? 1 : 0) +
    (flags.green ? 1 : 0);

  return flags;
}

function parse_produces_flags(colors: string[]): ProducesColorFlags {
  const color_map: Record<string, keyof Omit<ProducesColorFlags, "count">> = {
    W: "white",
    U: "blue",
    B: "black",
    R: "red",
    G: "green",
    C: "colorless",
  };

  const flags: ProducesColorFlags = {
    white: false,
    blue: false,
    black: false,
    red: false,
    green: false,
    colorless: false,
    count: 0,
  };

  for (const c of colors) {
    const key = color_map[c];
    if (key) {
      flags[key] = true;
    }
  }

  flags.count =
    (flags.white ? 1 : 0) +
    (flags.blue ? 1 : 0) +
    (flags.black ? 1 : 0) +
    (flags.red ? 1 : 0) +
    (flags.green ? 1 : 0) +
    (flags.colorless ? 1 : 0);

  return flags;
}

function parse_leadership_skills(
  mtgjson_skills: MTGJsonLeadershipSkills,
): CardLeadershipSkill[] {
  const skills: CardLeadershipSkill[] = [];
  for (const [skill, can_lead] of Object.entries(mtgjson_skills)) {
    if (can_lead) {
      skills.push({
        can_lead: skill as "brawl" | "commander" | "oathbreaker",
      });
    }
  }
  return skills;
}

function parse_legalities(
  mtgjson_legalities: MTGJsonLegalities,
): CardLegality[] {
  const legalities: CardLegality[] = [];
  for (const [format, legality] of Object.entries(mtgjson_legalities)) {
    legalities.push({ format, legality });
  }
  return legalities;
}
