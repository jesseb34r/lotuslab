import {
  createResource,
  createSignal,
  For,
  Match,
  Suspense,
  Switch,
} from "solid-js";
import { useNavigate } from "@solidjs/router";

import { Select } from "@kobalte/core/select";
import { ToggleGroup } from "@kobalte/core/toggle-group";

import { active_project_id, set_active_project_id } from "../index.tsx";
import { MoxcelDatabase } from "../lib/db.ts";
import { Button } from "../components/ui/button";
import { Dialog } from "../components/ui/dialog";
import { TextField } from "../components/ui/text-field";

const funny_deck_names = [
  "Tezzeret Control",
  "Cheeri0s",
  "Splinter Twin",
  "Pod",
  "Affinity",
  "Storm",
  "Burn",
  "Goblins",
  "Infect",
  "Jeskai Control",
  "Dredge",
  "Death and Taxes",
];

export function HomePage() {
  const [projects, { refetch }] = createResource(async () => {
    const db = await MoxcelDatabase.db();
    return db.get_project_list();
  });

  const [import_dialog_open, set_import_dialog_open] = createSignal(false);
  const [import_source, set_import_source] = createSignal<
    "blank" | "paste" | "file"
  >("blank");
  const [new_project_format, set_new_project_format] = createSignal<
    "list" | "modern" | "commander" | "cube"
  >("list");
  const [new_project_name, set_new_project_name] = createSignal("");
  const [project_cards_pasted, set_project_cards_pasted] = createSignal("");
  const [_project_cards_filepath, set_project_cards_filepath] =
    createSignal("");

  const navigate = useNavigate();

  async function handle_new_project() {
    const db = await MoxcelDatabase.db();
    const new_project_id = await db.create_project(new_project_name());

    // Add initial lists depending on the selected project format
    const format = new_project_format();
    switch (format) {
      case "list":
        await db.create_list(new_project_id, "list");
        break;
      case "modern":
        await db.create_list(new_project_id, "main deck");
        await db.create_list(new_project_id, "sideboard");
        break;
      case "commander":
        await db.create_list(new_project_id, "commander");
        await db.create_list(new_project_id, "main deck");
        break;
      case "cube":
        await db.create_list(new_project_id, "main");
        break;
    }

    set_active_project_id(new_project_id);
    refetch();

    // Clear all form input signals after submitting.
    set_import_dialog_open(false);
    set_import_source("blank");
    set_new_project_format("list");
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
            <Button
              onMouseDown={() => {
                const randomIndex = Math.floor(
                  Math.random() * funny_deck_names.length,
                );
                set_new_project_name(funny_deck_names[randomIndex]);
                set_import_dialog_open(true);
              }}
              variant="success"
            >
              New
            </Button>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>New Project</Dialog.Title>
              </Dialog.Header>
              <TextField
                value={new_project_name()}
                onChange={set_new_project_name}
              >
                <TextField.Label>Name</TextField.Label>
                <TextField.Input />
              </TextField>
              <Select
                value={new_project_format()}
                onChange={set_new_project_format}
                options={["list", "modern", "commander", "cube"]}
                itemComponent={(props) => (
                  <Select.Item
                    item={props.item}
                    class="px-4 py-2 cursor-pointer data-highlighted:bg-neutral-5"
                  >
                    <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
                    <Select.ItemIndicator>⋅</Select.ItemIndicator>
                  </Select.Item>
                )}
              >
                <Select.Trigger class="bg-neutral-7 px-2 py-1 rounded w-full cursor-pointer flex justify-between items-center">
                  <Select.Value<string>>
                    {(state) => state.selectedOption()}
                  </Select.Value>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content>
                    <Select.Listbox />
                  </Select.Content>
                </Select.Portal>
              </Select>
              <ToggleGroup
                value={import_source()}
                onChange={set_import_source}
                class="flex gap-2 mb-4"
              >
                <ToggleGroup.Item
                  value="blank"
                  class="px-2 py-1 rounded cursor-pointer bg-neutral-4 hover:bg-neutral-5 data-pressed:bg-neutral-5"
                >
                  Blank
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="paste"
                  class="px-2 py-1 rounded cursor-pointer bg-neutral-4 hover:bg-neutral-5 data-pressed:bg-neutral-5 "
                >
                  Paste
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="file"
                  class="px-2 py-1 rounded cursor-pointer bg-neutral-4 hover:bg-neutral-5 data-pressed:bg-neutral-5"
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
                    >
                      <TextField.Label>Paste List</TextField.Label>
                      <TextField.TextArea />
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
                        class="bg-neutral-7 px-1 py-1 rounded"
                      />
                    </div>
                  </Match>
                </Switch>
              </div>
              <Button onMouseDown={handle_new_project} variant="success">
                Create
              </Button>
            </Dialog.Content>
          </Dialog>
        </div>
        <hr class="text-gray-dim" />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <Suspense>
            <For each={projects()}>
              {(project) => (
                <Button
                  class="relative p-4 rounded bg-neutral-3 cursor-pointer"
                  onMouseDown={() => {
                    set_active_project_id(project.id);
                    navigate("/project");
                  }}
                >
                  <h3 class="text-lg font-medium">{project.name}</h3>
                  <Button
                    class="absolute top-2 right-2 p-2 rounded cursor-pointer bg-danger-3 hover:bg-danger-9"
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
