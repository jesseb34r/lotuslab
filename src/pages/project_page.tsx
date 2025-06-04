import { type Component, createSignal, For, Show } from "solid-js";
import { Portal } from "solid-js/web";
import type { ScryfallCard } from "@scryfall/api-types";

import { active_project_id } from "../index.tsx";
import type { Card } from "../lib/project.ts";

export function ProjectPage() {
  const [preview_ref, set_preview_ref] = createSignal<HTMLImageElement>();
  const [preview_show, set_preview_show] = createSignal(false);
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

  return (
    <main class="flex flex-col p-8">
      <Show when={active_project_id()}>
        {(project_id) => (
          <>
            {/* <h1 class="text-2xl font-medium">{project().name}</h1> */}
            {/* <DeckView list={project().lists[0].cards} /> */}
          </>
        )}
      </Show>
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
    </main>
  );
}
