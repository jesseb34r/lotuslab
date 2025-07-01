import { action, json, query, reload } from "@solidjs/router";
import Database from "@tauri-apps/plugin-sql";

// actions and queries

export const action_create_project = action(async (name: string) => {
  const db = await MoxcelDatabase.get_instance();
  const new_id = await db.create_project(name);
  return json(new_id, { revalidate: get_projects.key });
});

export const action_update_project_metadata = action(
  async (id: number, name?: string, description?: string) => {
    const db = await MoxcelDatabase.get_instance();
    await db.update_project_metadata(id, name, description);
    return reload({ revalidate: get_project_by_id.keyFor(id) });
  },
);

export const action_delete_project = action(async (id: number) => {
  const db = await MoxcelDatabase.get_instance();
  await db.delete_project(id);
  return reload({ revalidate: get_projects.key });
});

export const get_projects = query(async () => {
  const db = await MoxcelDatabase.get_instance();
  return await db.get_projects();
}, "get_projects");

export const get_project_by_id = query(async (id: number) => {
  const db = await MoxcelDatabase.get_instance();
  return await db.get_project_by_id(id);
}, "get_project_by_id");

export const action_create_list = action(
  async (project_id: number, name: string, description?: string) => {
    const db = await MoxcelDatabase.get_instance();
    const new_id = await db.create_list(project_id, name, description);
    // Optionally revalidate project or list queries
    return json(new_id, {
      revalidate: get_lists_by_project.keyFor(project_id),
    });
  },
);

export const action_update_list_metadata = action(
  async (id: number, name?: string, description?: string) => {
    const db = await MoxcelDatabase.get_instance();
    await db.update_list_metadata(id, name, description);
    return reload({ revalidate: get_lists_by_project.keyFor(id) });
  },
);

export const action_delete_list = action(
  async (id: number, project_id: number) => {
    const db = await MoxcelDatabase.get_instance();
    await db.delete_list(id);
    return reload({ revalidate: get_lists_by_project.keyFor(project_id) });
  },
);

export const action_add_cards_to_list = action(
  async (list_id: number, card_ids: string[]) => {
    const db = await MoxcelDatabase.get_instance();
    const inserted_ids: number[] = [];
    for (let id_index = 0; id_index < card_ids.length; id_index++) {
      const insertedId = await db.add_card_to_list(list_id, card_ids[id_index]);
      inserted_ids.push(insertedId);
    }
    return json(inserted_ids, {
      revalidate: [
        get_cards_in_list.keyFor(list_id),
        get_full_cards_in_list.keyFor(list_id),
      ],
    });
  },
);

export const get_lists_by_project = query(async (project_id: number) => {
  const db = await MoxcelDatabase.get_instance();
  return await db.get_lists_by_project(project_id);
}, "get_lists_by_project");

export const get_cards_in_list = query(async (list_id: number) => {
  const db = await MoxcelDatabase.get_instance();
  return await db.get_cards_in_list(list_id);
}, "get_cards_in_list");

export const get_full_cards_in_list = query(async (list_id: number) => {
  const db = await MoxcelDatabase.get_instance();
  return await db.get_full_cards_in_list(list_id);
}, "get_full_cards_in_list");

export const get_card_by_id = query(async (card_id: string) => {
  const db = await MoxcelDatabase.get_instance();
  return await db.get_card_by_id(card_id);
}, "get_card_by_id");

export const get_all_unique_card_names = query(async () => {
  const db = await MoxcelDatabase.get_instance();
  return await db.get_all_unique_card_names();
}, "get_all_unique_card_names");

export const search_cards_by_name = query(async (name: string) => {
  const db = await MoxcelDatabase.get_instance();
  return await db.search_cards_by_name(name);
}, "query_search_cards_by_name");

export const find_versions_by_exact_name = query(async (name: string) => {
  const db = await MoxcelDatabase.get_instance();
  return await db.find_versions_by_exact_name(name);
}, "find_versions_by_exact_name");

// =====================================================
// = Database Class: all actual db functions are below =
// =====================================================
class MoxcelDatabase {
  private static instance: MoxcelDatabase | null = null;
  private db: Database;

  private constructor(db: Database) {
    this.db = db;
  }

  static async get_instance(): Promise<MoxcelDatabase> {
    if (!MoxcelDatabase.instance) {
      const db = await Database.load("sqlite:data.db");
      MoxcelDatabase.instance = new MoxcelDatabase(db);
    }
    return MoxcelDatabase.instance;
  }

  // Project Operations

  /**
   * Creates a new project with the given name and format.
   * Make sure to validate that the name is unique or this will throw a db error
   *
   * @returns The index (id) of the new project.
   */
  async create_project(name: string): Promise<number> {
    if (name.trim().length === 0) {
      throw new Error("Project name must be a non-empty string.");
    }

    const existing = await this.db.select<{ id: number }[]>(
      "SELECT id FROM projects WHERE name = ?",
      [name],
    );
    if (existing.length > 0) {
      throw new Error(`Project name '${name}' already exists.`);
    }

    const result = await this.db.execute(
      "INSERT INTO projects (name, format) VALUES (?, ?)",
      [name, "list"],
    );
    await this.create_list(result.lastInsertId!, "main");
    return result.lastInsertId!;
  }

  /**
   * Updates the metadata (name and/or description) of an existing project.
   */
  async update_project_metadata(
    id: number,
    name?: string,
    description?: string,
  ): Promise<void> {
    if (name !== undefined && description !== undefined) {
      await this.db.execute(
        "UPDATE projects SET name = ?, description = ? WHERE id = ?",
        [name, description, id],
      );
    } else if (name !== undefined) {
      await this.db.execute("UPDATE projects SET name = ? WHERE id = ?", [
        name,
        id,
      ]);
    } else if (description !== undefined) {
      await this.db.execute(
        "UPDATE projects SET description = ? WHERE id = ?",
        [description, id],
      );
    }
  }

  /**
   * Deletes a project by its ID.
   */
  async delete_project(id: number): Promise<void> {
    await this.db.execute("DELETE FROM projects WHERE id = ?", [id]);
  }

  /**
   * Retrieves the list of all projects.
   *
   * @returns An array of ProjectMetadata objects for all projects.
   */
  async get_projects() {
    return await this.db.select<ProjectMetadata[]>("SELECT * FROM projects");
  }

  /**
   * Retrieves a project by its ID.
   *
   * @returns The ProjectMetadata object if found, or null if not found.
   */
  async get_project_by_id(id: number): Promise<ProjectMetadata | null> {
    const results = await this.db.select<ProjectMetadata[]>(
      "SELECT * FROM projects WHERE id = ?",
      [id],
    );
    return results.length > 0 ? results[0] : null;
  }

  // List CRUD methods

  /**
   * Creates a new list associated with a project.
   *
   * @returns The ID of the newly created list.
   */
  async create_list(
    project_id: number,
    name: string,
    description?: string,
  ): Promise<number> {
    const result = await this.db.execute(
      "INSERT INTO lists (project_id, name, description) VALUES (?, ?, ?)",
      [project_id, name, description ?? null],
    );

    if (result.lastInsertId !== undefined) {
      return result.lastInsertId;
    } else {
      throw new Error("Failed to get last insert ID for list");
    }
  }

  /**
   * Retrieves all lists belonging to a specific project.
   *
   * @returns An array of the ListMetadata of every list in the project.
   */
  async get_lists_by_project(project_id: number): Promise<ListMetadata[]> {
    const result = await this.db.select<ListMetadata[]>(
      "SELECT id, name, description FROM lists WHERE project_id = ?",
      [project_id],
    );
    return result;
  }

  /**
   * Updates the metadata (name and/or description) of a list.
   */
  async update_list_metadata(
    id: number,
    name?: string,
    description?: string,
  ): Promise<void> {
    if (name !== undefined && description !== undefined) {
      await this.db.execute(
        "UPDATE lists SET name = ?, description = ? WHERE id = ?",
        [name, description, id],
      );
    } else if (name !== undefined) {
      await this.db.execute("UPDATE lists SET name = ? WHERE id = ?", [
        name,
        id,
      ]);
    } else if (description !== undefined) {
      await this.db.execute("UPDATE lists SET description = ? WHERE id = ?", [
        description,
        id,
      ]);
    }
  }

  /**
   * Deletes a list by its ID.
   */
  async delete_list(id: number): Promise<void> {
    await this.db.execute("DELETE FROM lists WHERE id = ?", [id]);
  }

  // Cards in Lists CRUD

  /**
   * Adds a card to a list with optional notes.
   *
   * @returns The ID of the new cards_in_lists entry.
   */
  async add_card_to_list(
    list_id: number,
    card_id: string,
    notes?: string,
  ): Promise<number> {
    const result = await this.db.execute(
      "INSERT INTO cards_in_lists (list_id, card_id, notes) VALUES (?, ?, ?)",
      [list_id, card_id, notes ?? null],
    );
    if (result.lastInsertId !== undefined) {
      return result.lastInsertId;
    } else {
      throw new Error("Failed to get last insert ID for cards_in_lists");
    }
  }

  /**
   * Retrieves all cards belonging to a specific list.
   *
   * @returns An array of CardMetadata of every card in the list.
   */
  async get_cards_in_list(list_id: number): Promise<CardMetadata[]> {
    const result = await this.db.select<CardMetadata[]>(
      "SELECT id, card_id, notes FROM cards_in_lists WHERE list_id = ?",
      [list_id],
    );
    return result;
  }

  /**
   * Retrieves all cards in a list, joined with the cards table for full card data.
   *
   * @returns An array of objects: { metadata: CardMetadata, card: Card }
   */
  async get_full_cards_in_list(
    list_id: number,
  ): Promise<{ metadata: CardMetadata; card: Card }[]> {
    const rows = await this.db.select<
      {
        c_id: number;
        c_card_id: string;
        c_list_id: number;
        c_notes?: string;
        id: string; // correct - cards.id is scryfall id
        layout?: string | null;
        oracle_id?: string | null;
        scryfall_uri?: string | null;
        cmc: number;
        cid_white: number;
        cid_blue: number;
        cid_black: number;
        cid_red: number;
        cid_green: number;
        cid_count: number;
        is_white: number;
        is_blue: number;
        is_black: number;
        is_red: number;
        is_green: number;
        color_count: number;
        defense?: string | null;
        hand_modifier?: string | null;
        loyalty?: string | null;
        mana_cost?: string | null;
        name?: string | null;
        oracle_text?: string | null;
        power?: string | null;
        reserved: number;
        toughness?: string | null;
        type_line?: string | null;
        artist?: string | null;
        booster: number;
        card_back_id?: string | null;
        collector_number?: string | null;
        content_warning: number;
        digital: number;
        flavor_name?: string | null;
        flavor_text?: string | null;
        full_art: number;
        image_uri?: string | null;
        oversized: number;
        promo: number;
        rarity?: string | null;
        released_at?: string | null;
        reprint: number;
        set_name?: string | null;
        set_type?: string | null;
        set_code?: string | null;
        story_spotlight: number;
        textless: number;
        variation: number;
        variation_of?: string | null;
      }[]
    >(
      `SELECT
        cards_in_lists.id as c_id,
        cards_in_lists.card_id as c_card_id,
        cards_in_lists.list_id as c_list_id,
        cards_in_lists.notes as c_notes,
        cards.id, cards.layout, cards.oracle_id, cards.scryfall_uri, cards.cmc,
        cards.cid_white, cards.cid_blue, cards.cid_black, cards.cid_red, cards.cid_green, cards.cid_count,
        cards.is_white, cards.is_blue, cards.is_black, cards.is_red, cards.is_green, cards.color_count,
        cards.defense, cards.hand_modifier, cards.loyalty, cards.mana_cost, cards.name, cards.oracle_text, cards.power,
        cards.reserved, cards.toughness, cards.type_line, cards.artist, cards.booster, cards.card_back_id,
        cards.collector_number, cards.content_warning, cards.digital, cards.flavor_name, cards.flavor_text,
        cards.full_art, cards.image_uri, cards.oversized, cards.promo, cards.rarity, cards.released_at,
        cards.reprint, cards.set_name, cards.set_type, cards.set_code, cards.story_spotlight, cards.textless,
        cards.variation, cards.variation_of
      FROM cards_in_lists
      JOIN cards ON cards_in_lists.card_id = cards.id
      WHERE cards_in_lists.list_id = ?`,
      [list_id],
    );
    return rows.map((row) => ({
      metadata: {
        id: row.c_id,
        card_id: row.c_card_id,
        list_id: row.c_list_id,
        notes: row.c_notes,
      },
      card: {
        scryfall_id: row.id,
        layout: row.layout,
        oracle_id: row.oracle_id,
        scryfall_uri: row.scryfall_uri,
        cmc: row.cmc,
        cid_white: row.cid_white,
        cid_blue: row.cid_blue,
        cid_black: row.cid_black,
        cid_red: row.cid_red,
        cid_green: row.cid_green,
        cid_count: row.cid_count,
        is_white: row.is_white,
        is_blue: row.is_blue,
        is_black: row.is_black,
        is_red: row.is_red,
        is_green: row.is_green,
        color_count: row.color_count,
        defense: row.defense,
        hand_modifier: row.hand_modifier,
        loyalty: row.loyalty,
        mana_cost: row.mana_cost,
        name: row.name,
        oracle_text: row.oracle_text,
        power: row.power,
        reserved: row.reserved,
        toughness: row.toughness,
        type_line: row.type_line,
        artist: row.artist,
        booster: row.booster,
        card_back_id: row.card_back_id,
        collector_number: row.collector_number,
        content_warning: row.content_warning,
        digital: row.digital,
        flavor_name: row.flavor_name,
        flavor_text: row.flavor_text,
        full_art: row.full_art,
        image_uri: row.image_uri,
        oversized: row.oversized,
        promo: row.promo,
        rarity: row.rarity,
        released_at: row.released_at,
        reprint: row.reprint,
        set_name: row.set_name,
        set_type: row.set_type,
        set_code: row.set_code,
        story_spotlight: row.story_spotlight,
        textless: row.textless,
        variation: row.variation,
        variation_of: row.variation_of,
      },
    }));
  }

  /**
   * Updates the notes for a card in a list.
   */
  async update_card_in_list(id: number, notes?: string): Promise<void> {
    await this.db.execute("UPDATE cards_in_lists SET notes = ? WHERE id = ?", [
      notes ?? null,
      id,
    ]);
  }

  /**
   * Removes a card from a list by deleting the cards_in_lists entry.
   */
  async remove_card_from_list(id: number): Promise<void> {
    await this.db.execute("DELETE FROM cards_in_lists WHERE id = ?", [id]);
  }

  // Cards read-only methods

  /**
   * Retrieves card data by card ID.
   *
   * @returns The card record if found, or null if not found.
   */
  async get_card_by_id(card_id: string): Promise<Card | null> {
    const results = await this.db.select<Card[]>(
      "SELECT * FROM cards WHERE id = ?",
      [card_id],
    );
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Retrieves all unique card names and their oracle_ids.
   *
   * @returns An array of objects, each containing { name, oracle_id }.
   */
  async get_all_unique_card_names(): Promise<
    { name: string; oracle_id: string }[]
  > {
    const results = await this.db.select<{ name: string; oracle_id: string }[]>(
      "SELECT DISTINCT name, oracle_id FROM cards WHERE name IS NOT NULL AND oracle_id IS NOT NULL",
    );
    return results;
  }

  /**
   * Searches cards by name, returning the id and name for each match.
   * The search is case-insensitive and matches partial card names.
   *
   * @param name The (partial) name of the card to search for.
   * @returns An array of objects with id and name of matching cards.
   */
  async search_cards_by_name(
    name: string,
  ): Promise<{ id: string; name: string }[]> {
    if (!name || name.trim().length === 0) {
      return [];
    }
    // Use % for fuzzy and partial matching
    const queryStr = `${name.trim().toLowerCase()}%`;
    const results = await this.db.select<{ id: string; name: string }[]>(
      "SELECT id, name FROM cards WHERE LOWER(name) LIKE ? LIMIT 10",
      [queryStr],
    );
    return results;
  }

  /**
   * Finds all versions of a card given its exact name (case insensitive), returning id, name, released_at, set_code.
   *
   * @param name The exact name of the card.
   * @returns An array of objects: { id, name, released_at, set_code }
   */
  async find_versions_by_exact_name(name: string): Promise<
    {
      id: string;
      name: string | null;
      released_at: string | null;
      set_code: string | null;
    }[]
  > {
    if (!name || name.trim().length === 0) {
      return [];
    }
    const results = await this.db.select<
      {
        id: string;
        name: string | null;
        released_at: string | null;
        set_code: string | null;
      }[]
    >(
      "SELECT id, name, released_at, set_code FROM cards WHERE LOWER(name) = LOWER(?) ORDER BY released_at DESC",
      [name.trim()],
    );
    return results;
  }
}

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

export type ProjectMetadata = {
  id: number;
  name: string;
  format: (typeof project_format_options)[number];
  description?: string;
  primer?: string;
};

export type ListMetadata = {
  id: number;
  name: string;
  description?: string;
};

export type CardMetadata = {
  id: number;
  card_id: string; // reference to scryfall_id
  list_id: number;
  notes?: string;
};

export type Project = {
  metadata: ProjectMetadata;
  lists: {
    metadata: ListMetadata;
    cards: {
      metadata: CardMetadata;
    }[];
  }[];
};

export type Card = {
  scryfall_id: string;
  layout?: string | null;
  oracle_id?: string | null;
  scryfall_uri?: string | null;
  cmc: number;
  cid_white: number;
  cid_blue: number;
  cid_black: number;
  cid_red: number;
  cid_green: number;
  cid_count: number;
  is_white: number;
  is_blue: number;
  is_black: number;
  is_red: number;
  is_green: number;
  color_count: number;
  defense?: string | null;
  hand_modifier?: string | null;
  loyalty?: string | null;
  mana_cost?: string | null;
  name?: string | null;
  oracle_text?: string | null;
  power?: string | null;
  reserved: number;
  toughness?: string | null;
  type_line?: string | null;
  artist?: string | null;
  booster: number;
  card_back_id?: string | null;
  collector_number?: string | null;
  content_warning: number;
  digital: number;
  flavor_name?: string | null;
  flavor_text?: string | null;
  full_art: number;
  image_uri?: string | null;
  oversized: number;
  promo: number;
  rarity?: string | null;
  released_at?: string | null;
  reprint: number;
  set_name?: string | null;
  set_type?: string | null;
  set_code?: string | null;
  story_spotlight: number;
  textless: number;
  variation: number;
  variation_of?: string | null;
};
