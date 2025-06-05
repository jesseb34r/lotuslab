import Database from "@tauri-apps/plugin-sql";

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

export const create_project = async (name: string): Promise<number> => {
  const db = await Database.load("sqlite:data.db");
  const result = await db.execute("INSERT INTO projects (name) VALUES (?)", [name]);
  if (result.lastInsertId !== undefined) {
    return result.lastInsertId;
  } else {
    throw new Error("Failed to get last insert ID");
  }
};

export const get_project_list = async (): Promise<{ id: number; name: string }[]> => {
  const db = await Database.load("sqlite:data.db");
  const result = await db.select<ProjectMetadata[]>("SELECT * from projects");
  return result.map((project) => ({ id: project.id, name: project.name }));
};

export const get_project_by_id = async (id: number): Promise<ProjectMetadata | null> => {
  const db = await Database.load("sqlite:data.db");
  const results = await db.select<ProjectMetadata[]>("SELECT * from projects WHERE id = ?", [id]);
  return results.length > 0 ? results[0] : null;
};

export const update_project_metadata = async (id: number, name: string, description?: string): Promise<void> => {
  const db = await Database.load("sqlite:data.db");
  await db.execute("UPDATE projects SET name = ?, description = ? WHERE id = ?", [name, description ?? null, id]);
};

export const delete_project = async (id: number): Promise<void> => {
  const db = await Database.load("sqlite:data.db");
  await db.execute("DELETE FROM projects WHERE id = ?", [id]);
};
