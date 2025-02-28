import { A } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { Link } from "@kobalte/core/link";
import type { ScryfallCard } from "@scryfall/api-types";

import { active_list } from "../index.tsx";
import { Portal } from "solid-js/web";

export function ListPage() {
  const [preview_ref, set_preview_ref] = createSignal<HTMLImageElement>();
  const [preview_show, set_preview_show] = createSignal(false);
  const [preview_offset, set_preview_offset] = createSignal({ x: 0, y: 0 });
  const [preview_img_uri, set_preview_img_uri] = createSignal("");

  function handle_set_preview(e: MouseEvent, card: ScryfallCard.AnySingleFaced) {
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

  return (
    <main class="flex flex-col p-8">
      <div class="flex items-center gap-4 mb-6">
        <Link as={A} href="/" class="text-grass-11 dark:text-grassdark-11 hover:underline">
          ← Back to Home
        </Link>
        <Show when={active_list()}>
          {(list) => <h1 class="text-2xl font-medium">{list().name}</h1>}
        </Show>
      </div>

      <Show when={active_list()} fallback={<div>No list loaded</div>}>
        {(list) => (
          <div class="w-full max-w-3xl">
            <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              {/* Header */}
              <div class="font-medium text-gray-11 dark:text-graydark-11">#</div>
              <div class="font-medium text-gray-11 dark:text-graydark-11">Card Name</div>

              {/* Card list */}
              <ul class="flex flex-col items-start">
                <For each={list().cards}>
                  {(card) => (
                    <li
                      onMouseMove={(e) =>
                        handle_set_preview(e, card.card as ScryfallCard.AnySingleFaced)
                      }
                      onMouseOver={() => set_preview_show(true)}
                      onFocus={() => {}}
                      onMouseLeave={() => set_preview_show(false)}
                      class="cursor-pointer"
                    >
                      {`${card.quantity} ${card.card.name}`}
                    </li>
                  )}
                </For>
              </ul>
            </div>

            {/* Total count */}
            <div class="mt-4 text-sm text-gray-11 dark:text-graydark-11">
              Total Cards: {list().cards.reduce((sum, card) => sum + card.quantity, 0)}
            </div>
          </div>
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
