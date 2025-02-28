import { BaseDirectory, mkdir, writeTextFile, readTextFile, readDir } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import type { CardList } from "./card_list";

const LISTS_DIRECTORY = "lists";

export async function initialize_app_directory(): Promise<boolean> {
  try {
    await mkdir(LISTS_DIRECTORY, {
      baseDir: BaseDirectory.AppData,
      recursive: true,
    });
    return true;
  } catch (error) {
    console.error("Error creating app directory:", error);
    return false;
  }
}

export async function save_list(list: CardList): Promise<boolean> {
  try {
    const filename = `${list.id}.json`;
    const file_path = await join(LISTS_DIRECTORY, filename);

    await writeTextFile(file_path, JSON.stringify(list, null, 2), {
      baseDir: BaseDirectory.AppData,
    });

    return true;
  } catch (error) {
    console.error("Error saving list:", error);
    return false;
  }
}

export async function load_all_lists(): Promise<CardList[]> {
  try {
    const files = await readDir(LISTS_DIRECTORY, {
      baseDir: BaseDirectory.AppData,
    });

    const lists = await Promise.all(
      files
        .filter((file) => file.name?.endsWith(".json"))
        .map(async (file) => {
          const filepath = await join(LISTS_DIRECTORY, file.name!);
          const content = await readTextFile(filepath, { baseDir: BaseDirectory.AppData });
          return JSON.parse(content) as CardList;
        }),
    );

    return lists;
  } catch (error) {
    console.error("Error loading lists:", error);
    return [];
  }
}

export async function export_list_to_txt(list: CardList, export_path: string): Promise<boolean> {
  const content = list.cards.map((card) => `${card.quantity} ${card.card.name}`).join("\n");

  try {
    await writeTextFile(export_path, content);
    return true;
  } catch (error) {
    console.error("Error exporting list:", error);
    return false;
  }
}
