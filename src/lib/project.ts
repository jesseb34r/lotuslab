import type { ScryfallCard } from "@scryfall/api-types";

export type Card = {
  quantity: number;
  card: ScryfallCard.Any;
};

export type CardList = {
  name: string;
  cards: Card[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  lists: CardList[];
  created_at: string;
  modified_at: string;
};

// Naively parse a list of cards and fetch them from the scryfall api.
export async function parse_card_list_from_string(input_list: string): Promise<Card[]> {
  const lines = input_list
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.trim() !== "");

  const list: Card[] = [];

  for (const line of lines) {
    // Skip empty lines or comments
    if (line.trim() === "" || line.trim().startsWith("#")) continue;

    // Check if the line has a quantity prefix like "4x Card Name"
    const match = line.match(/^(\d+)(?:x\s*|\s+)(.+)$/i);

    if (match) {
      // Currently just uses 1 if the quantity is less than 1.
      const quantity = Math.max(1, Number.parseInt(match[1]));
      const cardName = match[2].trim();

      const card = await fetchCard(cardName);
      if (card) {
        list.push({ quantity: quantity, card: card });
      } else {
        console.warn(`Could not find card: ${cardName}`);
      }
    } else {
      // No quantity specified, just fetch the card once
      const card = await fetchCard(line);
      if (card) list.push({ quantity: 1, card: card });
    }

    // Delay to respect Scryfall's rate limiting (50-100ms between requests)
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  // Return a promise that will resolve to the card list
  return list;
}

// Fetch a single card from Scryfall API.
// TODO: Batch api calls and/or cache data locally
async function fetchCard(cardName: string): Promise<ScryfallCard.Any | null> {
  try {
    const encodedName = encodeURIComponent(cardName.trim());
    const response = await fetch(`https://api.scryfall.com/cards/named?exact=${encodedName}`);

    if (!response.ok) {
      console.error(`Failed to fetch card: ${cardName}`);
      return null;
    }

    return (await response.json()) as ScryfallCard.Any;
  } catch (error) {
    console.error(`Error fetching ${cardName}:`, error);
    return null;
  }
}

export type SortCriteria = {
  primary: SortField;
  secondary?: SortField;
  direction: "asc" | "desc";
};

export type SortField = "type" | "cmc" | "color" | "name_alpha";

enum CardType {
  Creature = "Creature",
  Planeswalker = "Planeswalker",
  Instant = "Instant",
  Sorcery = "Sorcery",
  Artifact = "Artifact",
  Enchantment = "Enchantment",
  Battle = "Battle",
  Land = "Land",
}

const type_order: Record<CardType, number> = {
  [CardType.Creature]: 1,
  [CardType.Planeswalker]: 2,
  [CardType.Instant]: 3,
  [CardType.Sorcery]: 4,
  [CardType.Artifact]: 5,
  [CardType.Enchantment]: 6,
  [CardType.Battle]: 7,
  [CardType.Land]: 8,
};

const get_type_order = (type_line: string) => {};

const get_sort_key = (card: ScryfallCard.Any, field: SortField) => {
  switch (field) {
    case "type":

    case "cmc":
      return "cmc" in card ? card.cmc : 0;
  }
};
