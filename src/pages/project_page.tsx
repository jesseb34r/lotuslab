import { Button } from "@kobalte/core/button";
import { Dialog } from "@kobalte/core/dialog";
import { TextField } from "@kobalte/core/text-field";
import type { ScryfallCard } from "@scryfall/api-types";
import { createAsync, useAction } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { Portal } from "solid-js/web";

import { active_project_id } from "../index.tsx";
import {
  action_update_project_metadata,
  get_lists_by_project,
  get_project_by_id,
} from "../lib/db";

export function ProjectPage() {
  const project_metadata = createAsync(() =>
    get_project_by_id(active_project_id()!),
  );
  const lists = createAsync(() => get_lists_by_project(project_metadata()!.id));

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

  const EditProjectDialog = () => {
    const [project_settings_dialog_open, set_project_settings_dialog_open] =
      createSignal(false);
    const [new_project_name, set_new_project_name] = createSignal("");
    const [new_project_description, set_new_project_description] =
      createSignal("");

    const update_project = useAction(action_update_project_metadata);

    const handle_edit_project = async () => {
      await update_project(
        active_project_id()!,
        new_project_name().trim(),
        new_project_description().trim(),
      );

      set_project_settings_dialog_open(false);
      set_new_project_name("");
    };

    return (
      <Dialog
        onOpenChange={set_project_settings_dialog_open}
        open={project_settings_dialog_open()}
        // TODO: figure out why it submits an empty string when you don't edit the name.
      >
        <Dialog.Trigger
          class="px-2 py-1 rounded cursor-pointer bg-success-3 hover:bg-success-4"
          onMouseDown={() => set_project_settings_dialog_open(true)}
        >
          Edit
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content class="flex flex-col items-center justify-center gap-4 fixed top-20 left-[50%] translate-x-[-50%] px-10 py-8 rounded bg-neutral-3 text-neutral-12">
            <Dialog.Title class="text-2xl mb-4">Edit Project</Dialog.Title>
            <form
              class="flex flex-col items-stretch justify-center gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handle_edit_project();
              }}
            >
              <TextField
                class="flex flex-col"
                onChange={set_new_project_name}
                value={new_project_name()}
              >
                <TextField.Label>Name</TextField.Label>
                <TextField.Input
                  autocorrect="off"
                  class="bg-neutral-7 px-1 rounded"
                  value={project_metadata()?.name ?? ""}
                />
              </TextField>
              <TextField
                class="flex flex-col"
                onChange={set_new_project_description}
                value={new_project_description()}
              >
                <TextField.Label>Description</TextField.Label>
                <TextField.TextArea
                  class="bg-neutral-7 px-1 rounded resize-none"
                  value={project_metadata()?.description ?? ""}
                />
              </TextField>
              <Button
                class="px-2 py-1 rounded self-end cursor-pointer bg-success-4 hover:bg-success-5"
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handle_edit_project();
                  }
                }}
                onMouseDown={handle_edit_project}
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
          alt="card preview"
          class="fixed aspect-[5/7] h-80 rounded-xl"
          ref={set_preview_ref}
          src={preview_img_uri()}
          style={{
            left: `${preview_offset()!.x}px`,
            "pointer-events": "none",
            top: `${preview_offset()!.y}px`,
          }}
        />
      </Portal>
    </Show>
  );

  return (
    <main class="flex flex-col pt-10 mx-auto w-[80%]">
      <Suspense fallback="resource not loaded">
        <div class="flex justify-between mb-margin">
          <h1 class="text-4xl">{project_metadata()?.name}</h1>
          <EditProjectDialog />
        </div>
        <Show when={project_metadata()?.description}>
          {(description) => (
            <>
              <h2 class="font-bold">Description</h2>
              <p>{description()}</p>
            </>
          )}
        </Show>
        <h2 class="font-bold">Lists</h2>
        <ul class="list-disc list-inside space-y-1">
          <For each={lists()}>
            {(list_metadata) => <li>{list_metadata.name}</li>}
          </For>
        </ul>
      </Suspense>
      <CardPreview />
    </main>
  );
}
