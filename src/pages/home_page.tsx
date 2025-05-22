import {
  createResource,
  createSignal,
  createUniqueId,
  For,
  Match,
  Show,
  Switch,
} from "solid-js";
import { useNavigate } from "@solidjs/router";

import { Button } from "@kobalte/core/button";
import { Dialog } from "@kobalte/core/dialog";
import { TextField } from "@kobalte/core/text-field";
import { ToggleGroup } from "@kobalte/core/toggle-group";

import { parse_card_list_from_string, type Project } from "../lib/project.ts";
import { set_active_project } from "../index.tsx";
import {
  initialize_app_directory,
  load_all_projects,
  save_project,
} from "../lib/file_operations.ts";

export function HomePage() {
  const [projects, { refetch: _ }] = createResource(fetch_projects);

  const [import_dialog_open, set_import_dialog_open] = createSignal(false);
  const [import_source, set_import_source] = createSignal<
    "blank" | "paste" | "file"
  >("blank");
  const [project_name, set_project_name] = createSignal("");
  const [project_cards_pasted, set_project_cards_pasted] = createSignal("");
  const [project_cards_filepath, set_project_cards_filepath] = createSignal("");

  const navigate = useNavigate();

  async function handle_create_project() {
    const now = new Date().toISOString();
    const new_project: Project = {
      id: createUniqueId(),
      name: project_name(),
      description: "",
      lists: [],
      created_at: now,
      modified_at: now,
    };

    switch (import_source()) {
      case "blank":
        break;
      case "paste": {
        new_project.lists.push({
          name: "main",
          cards: await parse_card_list_from_string(project_cards_pasted()),
        });
        break;
      }
      case "file": {
        // TODO
        project_cards_filepath();
        break;
      }
    }

    await save_project(new_project);
    // refetch_lists(); // is this needed if I'm immedietely navigating?

    set_active_project(new_project);
    navigate("/project", { replace: true });
  }

  return (
    <main class="flex flex-col pt-10 mx-auto w-[80%]">
      <div class="flex flex-col gap-2">
        <div class="flex gap-20 items-end justify-between">
          <h2 class="text-xl">Lists</h2>
          <Dialog
            open={import_dialog_open()}
            onOpenChange={set_import_dialog_open}
          >
            <Dialog.Trigger
              onMouseDown={() => set_import_dialog_open(true)}
              class="
                px-2 py-1 rounded cursor-pointer
                bg-grass-4 dark:bg-grassdark-4
                hover:bg-grass-5 dark:hover:bg-grassdark-5
              "
            >
              New
            </Dialog.Trigger>
            <Dialog.Portal>
              {/* <Dialog.Overlay class="w-screen h-screen fixed top-[0] left-[0] bg-gray-ghost" /> */}
              <Dialog.Content
                class="
                  flex flex-col items-center justify-center gap-4
                  fixed top-20 left-[50%] translate-x-[-50%]
                  px-10 py-8 rounded
                  bg-gray-3    dark:bg-graydark-3
                  text-gray-normal
                "
              >
                <Dialog.Title class="text-2xl mb-4">New List</Dialog.Title>
                <form
                  onSubmit={handle_create_project}
                  class="flex flex-col items-stretch justify-center"
                >
                  <TextField
                    value={project_name()}
                    onChange={set_project_name}
                    class="flex flex-col"
                  >
                    <TextField.Label>Name</TextField.Label>
                    <TextField.Input class="mb-4 bg-gray-7 dark:bg-graydark-7 px-1 rounded" />
                  </TextField>
                  <ToggleGroup
                    value={import_source()}
                    onChange={set_import_source}
                    class="flex gap-2 mb-4"
                  >
                    <ToggleGroup.Item
                      value="blank"
                      class="
                          px-2 py-1 rounded cursor-pointer
                          bg-gray-4 dark:bg-graydark-4
                          hover:bg-gray-5 dark:hover:bg-graydark-5
                          data-pressed:bg-gray-5 dark:data-pressed:bg-graydark-5"
                    >
                      Blank
                    </ToggleGroup.Item>
                    <ToggleGroup.Item
                      value="paste"
                      class="
                          px-2 py-1 rounded cursor-pointer
                          bg-gray-4 dark:bg-graydark-4
                          hover:bg-gray-5 dark:hover:bg-graydark-5
                          data-pressed:bg-gray-5 dark:data-pressed:bg-graydark-5"
                    >
                      Paste
                    </ToggleGroup.Item>
                    <ToggleGroup.Item
                      value="file"
                      class="
                          px-2 py-1 rounded cursor-pointer
                          bg-gray-4 dark:bg-graydark-4
                          hover:bg-gray-5 dark:hover:bg-graydark-5
                          data-pressed:bg-gray-5 dark:data-pressed:bg-graydark-5"
                    >
                      Import File
                    </ToggleGroup.Item>
                  </ToggleGroup>
                  <div class="mb-4">
                    <Switch>
                      <Match when={import_source() === "paste"}>
                        <TextField
                          value={project_cards_pasted()}
                          onChange={set_project_cards_pasted}
                          class="flex flex-col"
                        >
                          <TextField.Label>Paste List</TextField.Label>
                          <TextField.TextArea class="bg-gray-7 dark:bg-graydark-7 px-1 rounded resize-none" />
                        </TextField>
                      </Match>
                      <Match when={import_source() === "file"}>
                        <div class="flex flex-col">
                          <label for="file_input" class="mb-2">
                            Select a file to import
                          </label>
                          <input
                            id="file_input"
                            type="file"
                            accept=".txt,.csv"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) set_project_cards_filepath(file.name);
                            }}
                            class="bg-gray-7 dark:bg-graydark-7 px-1 py-1 rounded"
                          />
                        </div>
                      </Match>
                    </Switch>
                  </div>
                  <Button
                    onMouseDown={handle_create_project}
                    onKeyDown={(e: KeyboardEvent) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handle_create_project();
                      }
                    }}
                    class="
                      px-2 py-1 rounded self-end cursor-pointer
                      bg-grass-4 dark:bg-grassdark-4
                      hover:bg-grass-5 dark:hover:bg-grassdark-5
                    "
                  >
                    Create
                  </Button>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        </div>
        <hr class="text-gray-dim" />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <Show when={!projects.loading} fallback={<div>Loading lists...</div>}>
            <Show
              when={projects()?.length}
              fallback={<div>No lists found. Create one to get started!</div>}
            >
              <For each={projects()}>
                {(project) => (
                  <Button
                    class="p-4 rounded bg-gray-3 dark:bg-graydark-3 cursor-pointer"
                    onMouseDown={() => {
                      set_active_project(project);
                      navigate("/project");
                    }}
                  >
                    <h3 class="text-lg font-medium">{project.name}</h3>
                    <p class="text-sm text-gray-dim">
                      {project.lists[0].cards.length} cards • Modified{" "}
                      {new Date(project.modified_at).toLocaleDateString()}
                    </p>
                  </Button>
                )}
              </For>
            </Show>
          </Show>
        </div>
      </div>
    </main>
  );
}

async function fetch_projects() {
  await initialize_app_directory();
  return await load_all_projects();
}
