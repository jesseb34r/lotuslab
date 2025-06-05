import Database from "@tauri-apps/plugin-sql";

export class MoxcelDatabase {
  private static instance: MoxcelDatabase | null = null;
  private db: Database;

  private constructor(db: Database) {
    this.db = db;
  }

  static async db(): Promise<MoxcelDatabase> {
    if (!MoxcelDatabase.instance) {
      const db = await Database.load("sqlite:data.db");
      MoxcelDatabase.instance = new MoxcelDatabase(db);
    }
    return MoxcelDatabase.instance;
  }

  // Project CRUD methods

  /**
   * Creates a new project with the given name.
   *
   * @param name - The name of the project to create.
   * @returns The index (id) of the new project.
   */
  async create_project(name: string): Promise<number> {
    const result = await this.db.execute("INSERT INTO projects (name) VALUES (?)", [name]);

    if (result.lastInsertId !== undefined) {
      return result.lastInsertId;
    } else {
      throw new Error("Failed to get last insert ID");
    }
  }

  /**
   * Retrieves the list of all projects.
   *
   * @returns An array of ProjectMetadata objects for all projects.
   */
  async get_project_list(): Promise<ProjectMetadata[]> {
    const result = await this.db.select<ProjectMetadata[]>("SELECT * FROM projects");
    return result;
  }

  /**
   * Retrieves a project by its ID.
   *
   * @param id - The ID of the project to retrieve.
   * @returns The ProjectMetadata object if found, or null if not found.
   */
  async get_project_by_id(id: number): Promise<ProjectMetadata | null> {
    const results = await this.db.select<ProjectMetadata[]>("SELECT * FROM projects WHERE id = ?", [id]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Updates the metadata (name and/or description) of an existing project.
   *
   * @param id - The ID of the project to update.
   * @param name - Optional new name of the project.
   * @param description - Optional new description of the project.
   */
  async update_project_metadata(id: number, name?: string, description?: string): Promise<void> {
    if (name !== undefined && description !== undefined) {
      await this.db.execute("UPDATE projects SET name = ?, description = ? WHERE id = ?", [name, description, id]);
    } else if (name !== undefined) {
      await this.db.execute("UPDATE projects SET name = ? WHERE id = ?", [name, id]);
    } else if (description !== undefined) {
      await this.db.execute("UPDATE projects SET description = ? WHERE id = ?", [description, id]);
    }
  }

  /**
   * Deletes a project by its ID.
   *
   * @param id - The ID of the project to delete.
   */
  async delete_project(id: number): Promise<void> {
    await this.db.execute("DELETE FROM projects WHERE id = ?", [id]);
  }

  // List CRUD methods

  /**
   * Creates a new list associated with a project.
   *
   * @param project_id - The ID of the project the list belongs to.
   * @param name - The name of the new list.
   * @param description - Optional description of the list.
   * @returns The ID of the newly created list.
   */
  async create_list(project_id: number, name: string, description?: string): Promise<number> {
    const result = await this.db.execute("INSERT INTO lists (project_id, name, description) VALUES (?, ?, ?)", [
      project_id,
      name,
      description ?? null,
    ]);

    if (result.lastInsertId !== undefined) {
      return result.lastInsertId;
    } else {
      throw new Error("Failed to get last insert ID for list");
    }
  }

  /**
   * Retrieves all lists belonging to a specific project.
   *
   * @param project_id - The ID of the project to get lists from.
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
   *
   * @param id - The ID of the list to update.
   * @param name - Optional new name of the list.
   * @param description - Optional new description of the list.
   */
  async update_list_metadata(id: number, name?: string, description?: string): Promise<void> {
    if (name !== undefined && description !== undefined) {
      await this.db.execute("UPDATE lists SET name = ?, description = ? WHERE id = ?", [name, description, id]);
    } else if (name !== undefined) {
      await this.db.execute("UPDATE lists SET name = ? WHERE id = ?", [name, id]);
    } else if (description !== undefined) {
      await this.db.execute("UPDATE lists SET description = ? WHERE id = ?", [description, id]);
    }
  }

  /**
   * Deletes a list by its ID.
   *
   * @param id - The ID of the list to delete.
   */
  async delete_list(id: number): Promise<void> {
    await this.db.execute("DELETE FROM lists WHERE id = ?", [id]);
  }

  // Cards in Lists CRUD

  /**
   * Adds a card to a list with optional notes.
   *
   * @param list_id - The ID of the list to add the card to.
   * @param card_id - The ID of the card being added.
   * @param notes - Optional notes associated with the card in the list.
   * @returns The ID of the new cards_in_lists entry.
   */
  async add_card_to_list(list_id: number, card_id: string, notes?: string): Promise<number> {
    const result = await this.db.execute("INSERT INTO cards_in_lists (list_id, card_id, notes) VALUES (?, ?, ?)", [
      list_id,
      card_id,
      notes ?? null,
    ]);
    if (result.lastInsertId !== undefined) {
      return result.lastInsertId;
    } else {
      throw new Error("Failed to get last insert ID for cards_in_lists");
    }
  }

  /**
  /**
   * Retrieves all cards belonging to a specific list.
   *
   * @param list_id - The ID of the list to get cards from.
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
   * Updates the notes for a card in a list.
   *
   * @param id - The ID of the cards_in_lists entry to update.
   * @param notes - Optional new notes for the card.
   */
  async update_card_in_list(id: number, notes?: string): Promise<void> {
    await this.db.execute("UPDATE cards_in_lists SET notes = ? WHERE id = ?", [notes ?? null, id]);
  }

  /**
   * Removes a card from a list by deleting the cards_in_lists entry.
   *
   * @param id - The ID of the cards_in_lists entry to delete.
   */
  async remove_card_from_list(id: number): Promise<void> {
    await this.db.execute("DELETE FROM cards_in_lists WHERE id = ?", [id]);
  }

  // Cards read-only methods

  /**
   * Retrieves card data by card ID.
   *
   * @param card_id - The ID of the card to retrieve.
   * @returns The card record if found, or null if not found.
   */
  async get_card_by_id(card_id: string): Promise<Card | null> {
    const results = await this.db.select<Card[]>("SELECT * FROM cards WHERE id = ?", [card_id]);
    return results.length > 0 ? results[0] : null;
  }
}

export type ProjectMetadata = {
  id: number;
  name: string;
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
  card_id: string;
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
  id: string;
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
