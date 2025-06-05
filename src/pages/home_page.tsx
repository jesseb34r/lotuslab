import {
  createResource,
  createSignal,
  For,
  Match,
  Suspense,
  Switch,
} from "solid-js";
import { useNavigate } from "@solidjs/router";

import { Button } from "@kobalte/core/button";
import { Dialog } from "@kobalte/core/dialog";
import { TextField } from "@kobalte/core/text-field";
import { ToggleGroup } from "@kobalte/core/toggle-group";

import { active_project_id, set_active_project_id } from "../index.tsx";
import { MoxcelDatabase } from "../lib/db.ts";

export function HomePage() {
  const [projects, { refetch }] = createResource(async () => {
    const db = await MoxcelDatabase.db();
    return db.get_project_list();
  });

  const [import_dialog_open, set_import_dialog_open] = createSignal(false);
  const [import_source, set_import_source] = createSignal<
    "blank" | "paste" | "file"
  >("blank");
  const [new_project_name, set_new_project_name] = createSignal("");
  const [project_cards_pasted, set_project_cards_pasted] = createSignal("");
  const [_project_cards_filepath, set_project_cards_filepath] =
    createSignal("");

  const navigate = useNavigate();

  async function handle_new_project_form_submit() {
    const db = await MoxcelDatabase.db();
    const new_project_id = await db.create_project(new_project_name());
    set_active_project_id(new_project_id);
    refetch();

    // Clear all form input signals after submitting.
    set_import_dialog_open(false);
    set_import_source("blank");
    set_new_project_name("");
    set_project_cards_pasted("");
    set_project_cards_filepath("");

    // navigate("/project", { replace: true });
  }

  async function handle_delete_project(id: number) {
    const db = await MoxcelDatabase.db();
    if (id === active_project_id()) {
      set_active_project_id(undefined);
    }

    await db.delete_project(id);
  }

  return (
    <main class="flex flex-col pt-10 mx-auto w-[80%]">
      <div class="flex flex-col gap-2">
        <div class="flex gap-20 items-end justify-between">
          <h2 class="text-xl">Projects</h2>
          <Dialog
            open={import_dialog_open()}
            onOpenChange={set_import_dialog_open}
          >
            <Dialog.Trigger
              onMouseDown={() => set_import_dialog_open(true)}
              class="
                px-2 py-1 rounded cursor-pointer
                bg-grass-3 dark:bg-grassdark-3
                hover:bg-grass-4 dark:hover:bg-grassdark-4
              "
            >
              New
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content
                class="
                  flex flex-col items-center justify-center gap-4
                  fixed top-20 left-[50%] translate-x-[-50%]
                  px-10 py-8 rounded
                  bg-gray-3 dark:bg-graydark-3
                  text-gray-normal
                "
              >
                <Dialog.Title class="text-2xl mb-4">New Project</Dialog.Title>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handle_new_project_form_submit();
                  }}
                  class="flex flex-col items-stretch justify-center"
                >
                  <TextField
                    value={new_project_name()}
                    onChange={set_new_project_name}
                    class="flex flex-col"
                  >
                    <TextField.Label>Name</TextField.Label>
                    <TextField.Input
                      class="mb-4 bg-gray-7 dark:bg-graydark-7 px-1 rounded"
                      autocorrect="off"
                    />
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
                    onMouseDown={handle_new_project_form_submit}
                    onKeyDown={(e: KeyboardEvent) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handle_new_project_form_submit();
                      }
                    }}
                    class="
                      px-2 py-1 rounded self-end cursor-pointer
                      bg-grass-4 dark:bg-grassdark-4
                      hover:bg-grass-5 dark:hover:bg-grassdark-5"
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
          <Suspense>
            <For each={projects()}>
              {(project) => (
                <Button
                  class="relative p-4 rounded bg-gray-3 dark:bg-graydark-3 cursor-pointer"
                  onMouseDown={() => {
                    set_active_project_id(project.id);
                    navigate("/project");
                  }}
                >
                  <h3 class="text-lg font-medium">{project.name}</h3>
                  <Button
                    class="
                        absolute top-2 right-2 p-2 rounded cursor-pointer
                        bg-tomato-3 dark:bg-tomatodark-3 hover:bg-tomato-9 hover:dark:bg-tomatodark-9
                      "
                    onMouseDown={(e: MouseEvent) => {
                      e.stopPropagation();
                      handle_delete_project(project.id).then(refetch);
                    }}
                  >
                    ×
                  </Button>
                </Button>
              )}
            </For>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
