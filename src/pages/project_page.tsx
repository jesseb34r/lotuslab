import { type Component, createSignal, For, Show } from "solid-js";
import { Portal } from "solid-js/web";
import type { ScryfallCard } from "@scryfall/api-types";

import { active_project } from "../index.tsx";
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

  return (
    <main class="flex flex-col p-8">
      <Show when={active_project()}>
        {(project) => (
          <>
            <h1 class="text-2xl font-medium">{project().name}</h1>
            <TableView list={project().lists[0].cards} />
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
