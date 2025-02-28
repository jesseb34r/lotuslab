import { BaseDirectory, mkdir, writeTextFile, readTextFile, readDir } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import type { CardList } from "./card_list";

const LISTS_DIRECTORY = "lists";

export async function initialize_app_directory(): Promise<void> {
  await mkdir(LISTS_DIRECTORY, {
    baseDir: BaseDirectory.AppData,
    recursive: true,
  });
}

export async function save_list(list: CardList): Promise<void> {
  const filename = `${list.id}.json`;
  const file_path = await join(LISTS_DIRECTORY, filename);

  await writeTextFile(file_path, JSON.stringify(list, null, 2), {
    baseDir: BaseDirectory.AppData,
  });
}

export async function load_all_lists(): Promise<CardList[]> {
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
}

export async function export_list_to_txt(list: CardList, export_path: string): Promise<void> {
  const content = list.cards.map((card) => `${card.quantity} ${card.card.name}`).join("\n");

  await writeTextFile(export_path, content);
}
