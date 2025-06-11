import {
  type Component,
  createResource,
  createSignal,
  For,
  Show,
  Suspense,
} from "solid-js";
import { Portal } from "solid-js/web";
import type { ScryfallCard } from "@scryfall/api-types";
import { Dialog } from "@kobalte/core/dialog";
import { TextField } from "@kobalte/core/text-field";
import { Button } from "@kobalte/core/button";

import { active_project_id } from "../index.tsx";
import type { Card } from "../lib/project.ts";
import { MoxcelDatabase } from "../lib/db";

export function ProjectPage() {
  const [project_metadata, { refetch: refetch_project_metadata }] =
    createResource(async () => {
      const db = await MoxcelDatabase.db();
      return db.get_project_by_id(active_project_id()!);
    });

  const [lists, { refetch: refetch_lists }] = createResource(
    () => project_metadata()?.id,
    async (id) => {
      if (!id) {
        return [];
      } else {
        const db = await MoxcelDatabase.db();
        return db.get_lists_by_project(id);
      }
    },
  );

  const [preview_show, set_preview_show] = createSignal(false);
  const [preview_ref, set_preview_ref] = createSignal<HTMLImageElement>();
  const [preview_offset, set_preview_offset] = createSignal({ x: 0, y: 0 });
  const [preview_img_uri, set_preview_img_uri] = createSignal("");

  function handle_set_preview(
    e: MouseEvent,
    card: ScryfallCard.AnySingleFaced,
  ) {
    const offsetX =
      e.x + preview_ref()!.getBoundingClientRect().width > window.innerWidth
        ? window.innerWidth - preview_ref()!.getBoundingClientRect().width
        : e.x + 5;
    const offsetY =
      e.y + preview_ref()!.getBoundingClientRect().height > window.innerHeight
        ? window.innerHeight - preview_ref()!.getBoundingClientRect().height
        : e.y + 10;
    set_preview_offset({ x: offsetX, y: offsetY });
    set_preview_img_uri(card.image_uris!.normal);
  }

  const TableView: Component<{ list: Card[] }> = (props) => (
    <div class="w-full max-w-5xl">
      <div class="border overflow-hidden">
        <div class="grid grid-cols-[80px_minmax(200px,1fr)_120px_1fr] border-b bg-gray-1 dark:bg-graydark-1">
          {/* Header */}
          <div class="font-medium text-gray-12 dark:text-graydark-12 p-3">
            #
          </div>
          <div class="font-medium text-gray-12 dark:text-graydark-12 p-3">
            Name
          </div>
          <div class="font-medium text-gray-12 dark:text-graydark-12 p-3">
            Mana Cost
          </div>
          <div class="font-medium text-gray-12 dark:text-graydark-12 p-3">
            Tags
          </div>
        </div>

        {/* Card list */}
        <For each={props.list}>
          {(card) => (
            <div
              class="grid grid-cols-[80px_minmax(200px,1fr)_120px_1fr] border-b last:border-b-0 hover:bg-gray-2 dark:hover:bg-graydark-2 transition-colors"
              onMouseMove={(e) =>
                handle_set_preview(e, card.card as ScryfallCard.AnySingleFaced)
              }
              onMouseOver={() => set_preview_show(true)}
              onMouseLeave={() => set_preview_show(false)}
              onFocus={() => {}}
            >
              {/* Quantity column */}
              <div class="p-3 flex items-center cursor-pointer">
                {card.quantity}
              </div>

              {/* Name column */}
              <div class="p-3 flex items-center cursor-pointer">
                {card.card.name}
              </div>

              {/* Mana Cost column */}
              <div class="p-3 flex items-center font-mono">
                {card.card.mana_cost || ""}
              </div>

              {/* Tags column (stub for future) */}
              <div class="p-3 flex items-center text-gray-9 dark:text-graydark-9 italic">
                {/* Empty for now - will hold tags in the future */}
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Total count */}
      <div class="mt-4 text-sm text-gray-11 dark:text-graydark-11">
        Total Cards: {props.list.reduce((sum, card) => sum + card.quantity, 0)}
      </div>
    </div>
  );

  const DeckView: Component<{ list: Card[] }> = (props) => {
    const type_groups: Record<string, Card[]> = {};

    const get_type = (type_line: string): string => {
      const before_subtypes = type_line.split("—")[0].trim();
      const words = before_subtypes.split(" ");
      return words[words.length - 1];
    };

    // Group cards by their type line
    for (const card of props.list) {
      if (card.card.layout !== "normal") {
        if (!type_groups.misc) {
          type_groups.misc = [];
        }
        type_groups.misc.push(card);
      } else {
        const type = get_type(card.card.type_line);
        if (!type_groups[type]) {
          type_groups[type] = [];
        }
        type_groups[type].push(card);
      }
    }

    // Sort type groups by priority (creatures, instants, sorceries, etc.)
    const type_priority = [
      "Creature",
      "Instant",
      "Sorcery",
      "Enchantment",
      "Artifact",
      "Planeswalker",
      "Battle",
      "Land",
    ];
    const sorted_type_keys = Object.keys(type_groups).sort((a, b) => {
      const a_priority = type_priority.findIndex((type) => a.includes(type));
      const b_priority = type_priority.findIndex((type) => b.includes(type));

      if (a_priority === -1 && b_priority === -1) return a.localeCompare(b);
      if (a_priority === -1) return 1;
      if (b_priority === -1) return -1;

      return a_priority - b_priority;
    });

    return (
      <div class="w-full max-w-3xl">
        <For each={sorted_type_keys}>
          {(type_key) => (
            <div class="mb-6">
              <h3 class="text-lg font-medium mb-3 text-gray-12 dark:text-graydark-12">
                {type_key} (
                {type_groups[type_key].reduce(
                  (sum, card) => sum + card.quantity,
                  0,
                )}
                )
              </h3>
              <div class="space-y-1">
                <For each={type_groups[type_key]}>
                  {(card) => (
                    <div
                      class="flex items-center gap-3 p-2 hover:bg-gray-2 dark:hover:bg-graydark-2 rounded transition-colors"
                      onMouseMove={(e) =>
                        handle_set_preview(
                          e,
                          card.card as ScryfallCard.AnySingleFaced,
                        )
                      }
                      onMouseOver={() => set_preview_show(true)}
                      onMouseLeave={() => set_preview_show(false)}
                    >
                      <span class="w-8 text-center text-sm">
                        {card.quantity}
                      </span>
                      <span class="flex-1">{card.card.name}</span>
                      <span class="font-mono text-sm">
                        {card.card.mana_cost || ""}
                      </span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    );
  };

  const EditProjectDialog = () => {
    const [project_settings_dialog_open, set_project_settings_dialog_open] =
      createSignal(false);
    const [new_project_name, set_new_project_name] = createSignal("");
    const [new_project_description, set_new_project_description] =
      createSignal("");

    const handle_edit_project = async () => {
      const db = await MoxcelDatabase.db();
      await db.update_project_metadata(
        active_project_id()!,
        new_project_name().trim(),
        new_project_description().trim(),
      );

      set_project_settings_dialog_open(false);
      set_new_project_name("");

      refetch_project_metadata();
    };

    return (
      <Dialog
        open={project_settings_dialog_open()}
        onOpenChange={set_project_settings_dialog_open}
        // TODO: figure out why it submits an empty string when you don't edit the name.
      >
        <Dialog.Trigger
          onMouseDown={() => set_project_settings_dialog_open(true)}
          class="
            absolute top-8 right-8
            px-2 py-1 rounded cursor-pointer
            bg-grass-3 dark:bg-grassdark-3
            hover:bg-grass-4 dark:hover:bg-grassdark-4
          "
        >
          Edit
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
            <Dialog.Title class="text-2xl mb-4">Edit Project</Dialog.Title>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handle_edit_project();
              }}
              class="flex flex-col items-stretch justify-center gap-4"
            >
              <TextField
                value={new_project_name()}
                onChange={set_new_project_name}
                class="flex flex-col"
              >
                <TextField.Label>Name</TextField.Label>
                <TextField.Input
                  class="bg-gray-7 dark:bg-graydark-7 px-1 rounded"
                  autocorrect="off"
                  value={project_metadata()?.name ?? ""}
                />
              </TextField>
              <TextField
                value={new_project_description()}
                onChange={set_new_project_description}
                class="flex flex-col"
              >
                <TextField.Label>Description</TextField.Label>
                <TextField.TextArea
                  class="bg-gray-7 dark:bg-graydark-7 px-1 rounded resize-none"
                  value={project_metadata()?.description ?? ""}
                />
              </TextField>
              <Button
                onMouseDown={handle_edit_project}
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handle_edit_project();
                  }
                }}
                class="
                  px-2 py-1 rounded self-end cursor-pointer
                  bg-grass-4 dark:bg-grassdark-4
                  hover:bg-grass-5 dark:hover:bg-grassdark-5"
              >
                Submit
              </Button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    );
  };

  const CardPreview = () => (
    <Show when={preview_show()}>
      <Portal>
        <img
          ref={set_preview_ref}
          class="fixed aspect-[5/7] h-80 rounded-xl"
          style={{
            left: `${preview_offset()!.x}px`,
            top: `${preview_offset()!.y}px`,
            "pointer-events": "none",
          }}
          src={preview_img_uri()}
          alt="card preview"
        />
      </Portal>
    </Show>
  );

  return (
    <main class="relative flex flex-col p-8">
      <Suspense fallback="resource not loaded">
        <h1 class="text-2xl font-medium pb-6">{project_metadata()?.name}</h1>
        <h2 class="font-bold">Description</h2>
        <p>{project_metadata()?.description}</p>
        <hr class="text-gray-dim my-4" />
        <Show when={!lists.loading} fallback={<div>Loading lists...</div>}>
          <h2 class="font-bold">Lists</h2>
          <ul class="list-disc list-inside space-y-1">
            <For each={lists()}>
              {(list_metadata) => <li>{list_metadata.name}</li>}
            </For>
          </ul>
        </Show>
        <EditProjectDialog />
      </Suspense>
      <CardPreview />
    </main>
  );
}
