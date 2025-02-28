import { BaseDirectory, mkdir, writeTextFile, readTextFile, readDir } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import type { Project } from "./project";

const PROJECTS_DIRECTORY = "projects";

export async function initialize_app_directory(): Promise<void> {
  await mkdir(PROJECTS_DIRECTORY, {
    baseDir: BaseDirectory.AppData,
    recursive: true,
  });
}

export async function save_project(project: Project): Promise<void> {
  const filename = `${project.id}.json`;
  const file_path = await join(PROJECTS_DIRECTORY, filename);

  await writeTextFile(file_path, JSON.stringify(project, null, 2), {
    baseDir: BaseDirectory.AppData,
  });
}

export async function load_all_projects(): Promise<Project[]> {
  const files = await readDir(PROJECTS_DIRECTORY, {
    baseDir: BaseDirectory.AppData,
  });

  const lists = await Promise.all(
    files
      .filter((file) => file.name?.endsWith(".json"))
      .map(async (file) => {
        const filepath = await join(PROJECTS_DIRECTORY, file.name!);
        const content = await readTextFile(filepath, { baseDir: BaseDirectory.AppData });
        return JSON.parse(content) as Project;
      }),
  );

  return lists;
}
