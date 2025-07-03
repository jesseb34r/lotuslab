import type { ScryfallCard } from "@scryfall/api-types";
import Database from "@tauri-apps/plugin-sql";

export async function sync_scryfall_cards() {
  console.log("starting");
  const default_cards = await get_default_cards();

  for (const card of default_cards) {
    if (card.layout === "normal") {
      const db = await Database.load("sqlite:data.db");
      await insert_normal_card(card, db);
    }
  }
  console.log("done");
}

export async function get_default_cards(): Promise<ScryfallCard.Any[]> {
  const urls_response = await fetch(
    "https://api.scryfall.com/bulk-data/default_cards",
  );
  if (!urls_response.ok) {
    throw new Error(
      `Failed to fetch default_cards.json metadata: ${urls_response.statusText}`,
    );
  }
  const urls_data = await urls_response.json();
  const cards_url = urls_data.download_uri;
  const cards_response = await fetch(cards_url);
  if (!cards_response.ok) {
    throw new Error(
      `Failed to fetch default_cards.json: ${cards_response.statusText}`,
    );
  }
  const cards_json: ScryfallCard.Any[] = await cards_response.json();
  return cards_json;
}

async function insert_normal_card(card: ScryfallCard.Normal, db: Database) {
  await db.execute(
    `INSERT OR IGNORE INTO cards (
            id,
            layout,
            oracle_id,
            scryfall_uri,
            cmc,
            cid_white,
            cid_blue,
            cid_black,
            cid_red,
            cid_green,
            cid_count,
            is_white,
            is_blue,
            is_black,
            is_red,
            is_green,
            color_count,
            defense,
            loyalty,
            mana_cost,
            name,
            oracle_text,
            power,
            reserved,
            toughness,
            type_line,
            artist,
            booster,
            card_back_id,
            collector_number,
            content_warning,
            digital,
            flavor_name,
            flavor_text,
            full_art,
            image_uri,
            oversized,
            promo,
            rarity,
            released_at,
            reprint,
            set_name,
            set_type,
            set_code,
            story_spotlight,
            textless,
            variation,
            variation_of
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      card.id,
      card.layout,
      card.oracle_id,
      card.scryfall_uri,

      card.cmc ?? 0,
      // color_identity
      card.color_identity?.includes("W") ? 1 : 0,
      card.color_identity?.includes("U") ? 1 : 0,
      card.color_identity?.includes("B") ? 1 : 0,
      card.color_identity?.includes("R") ? 1 : 0,
      card.color_identity?.includes("G") ? 1 : 0,
      card.color_identity?.length ?? 0,
      // colors
      card.colors?.includes("W") ? 1 : 0,
      card.colors?.includes("U") ? 1 : 0,
      card.colors?.includes("B") ? 1 : 0,
      card.colors?.includes("R") ? 1 : 0,
      card.colors?.includes("G") ? 1 : 0,
      card.colors?.length ?? 0,

      card.defense ?? null,
      card.loyalty ?? null,
      card.mana_cost ?? null,
      card.name ?? null,
      card.oracle_text ?? null,
      card.power ?? null,
      card.reserved ? 1 : 0,
      card.toughness ?? null,
      card.type_line ?? null,

      card.artist ?? null,
      card.booster ? 1 : 0,
      card.card_back_id ?? null,
      card.collector_number ?? null,
      card.content_warning ? 1 : 0,
      card.digital ? 1 : 0,
      card.flavor_name ?? null,
      card.flavor_text ?? null,
      card.full_art ? 1 : 0,
      card.image_uris?.normal ?? null,
      card.oversized ? 1 : 0,
      card.promo ? 1 : 0,
      card.rarity ?? null,
      card.released_at ?? null,
      card.reprint ? 1 : 0,
      card.set_name ?? null,
      card.set_type ?? null,
      card.set ?? null,
      card.story_spotlight ? 1 : 0,
      card.textless ? 1 : 0,
      card.variation ? 1 : 0,
      card.variation_of ?? null,
      // Add two more nulls for the extra columns, assuming columns missing in values
      null,
    ],
  );
}

// test functions
async function get_local_default_cards(): Promise<ScryfallCard.Any[]> {
  const module = await import("../../test-files/default_cards.json");
  return module.default as ScryfallCard.Any[];
}
