import { Search } from "@kobalte/core/search";
import type { ScryfallCard } from "@scryfall/api-types";
import { createAsync, useAction } from "@solidjs/router";
import { type Component, createSignal, For, Show, Suspense } from "solid-js";
import { Portal } from "solid-js/web";
import { IconPencil, IconPlus, IconSearch } from "../components/icons.tsx";
import { Button } from "../components/ui/button";
import { Dialog } from "../components/ui/dialog";
import { TextField } from "../components/ui/text-field";
import { active_project_id, useUniqueCardNames } from "../index.tsx";
import {
  action_update_project_metadata,
  get_card_by_id,
  get_cards_in_list,
  get_lists_by_project,
  get_project_by_id,
  search_cards_by_name,
} from "../lib/db";

export function ProjectPage() {
  const project_metadata = createAsync(() =>
    get_project_by_id(active_project_id()!),
  );
  const lists = createAsync(() => {
    const local_metadata = project_metadata();
    if (!local_metadata || !local_metadata.id) {
      return Promise.resolve([]);
    }
    return get_lists_by_project(local_metadata.id);
  });

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

    // When dialog opens, default the signals to current values
    function handle_open() {
      set_new_project_name(project_metadata()?.name ?? "");
      set_new_project_description(project_metadata()?.description ?? "");
      set_project_settings_dialog_open(true);
    }

    const handle_edit_project = async () => {
      await update_project(
        active_project_id()!,
        new_project_name().trim(),
        new_project_description().trim(),
      );
      set_project_settings_dialog_open(false);
      set_new_project_name("");
      set_new_project_description("");
    };

    return (
      <Dialog
        onOpenChange={set_project_settings_dialog_open}
        open={project_settings_dialog_open()}
      >
        <Button onMouseDown={handle_open} size="icon" variant="success">
          <IconPencil />
        </Button>
        <Dialog.Content
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handle_edit_project();
            }
          }}
        >
          <Dialog.CloseButtonX
            onMouseDown={() => set_project_settings_dialog_open(false)}
          />
          <Dialog.Header>
            <Dialog.Title>Edit Project</Dialog.Title>
          </Dialog.Header>
          <div class="flex flex-col items-stretch justify-center gap-4">
            <TextField
              onChange={set_new_project_name}
              value={new_project_name()}
            >
              <TextField.Label>Name</TextField.Label>
              <TextField.Input />
            </TextField>
            <TextField
              onChange={set_new_project_description}
              value={new_project_description()}
            >
              <TextField.Label>Description</TextField.Label>
              <TextField.TextArea />
            </TextField>
            <Button
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  handle_edit_project();
                }
              }}
              onMouseDown={handle_edit_project}
              variant="success"
            >
              Submit
            </Button>
          </div>
        </Dialog.Content>
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
      <Suspense>
        <div class="flex mb-margin justify-between items-baseline">
          <h1 class="text-4xl leading-tight">{project_metadata()?.name}</h1>
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
        <div class="flex mb-margin mt-gutter justify-between items-baseline">
          <h2 class="font-bold">Main</h2>
          <AddCardSearch />
        </div>
        <ul class="list-disc list-inside space-y-1">
          <Suspense>
            <Show when={lists()}>
              {(all_lists) => {
                const main_list = all_lists().find(
                  (list) => list.name === "main",
                );
                const cards = createAsync(() =>
                  get_cards_in_list(main_list!.id),
                );
                return (
                  <Suspense>
                    <For each={cards()}>
                      {(card) => <Card card_id={card.card_id} />}
                    </For>
                  </Suspense>
                );
              }}
            </Show>
          </Suspense>
        </ul>
      </Suspense>
      <CardPreview />
    </main>
  );
}

const Card: Component<{ card_id: string }> = (props) => {
  const card_details = createAsync(() => get_card_by_id(props.card_id));
  return <li>{card_details()?.name}</li>;
};

const AddCardSearch = () => {
  const [options, set_options] = createSignal<
    { name: string; oracle_id: string }[]
  >([]);
  const [card, set_card] = createSignal<{
    name: string;
    oracle_id: string;
  } | null>();
  const unique_card_names = useUniqueCardNames();

  return (
    <Search
      itemComponent={(props) => (
        <Search.Item
          class="relative flex cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-neutral-4 data-[disabled]:opacity-50 text-neutral-11 data-[highlighted]:text-neutral-12"
          item={props.item}
        >
          <Search.ItemLabel>{props.item.rawValue.name}</Search.ItemLabel>
        </Search.Item>
      )}
      onChange={(result) => set_card(result)}
      onInputChange={(query) => {
        if (!query) {
          set_options([]);
          return;
        }

        const filtered = unique_card_names!()!.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase()),
        );

        set_options(filtered);
      }}
      optionLabel={(o) => o.name}
      options={options()}
      placeholder="Search a card..."
      triggerMode="input"
    >
      <Search.Label />

      <Search.Control class="flex h-10 items-center rounded-md border px-3">
        <Search.Indicator>
          <Search.Icon>
            <IconSearch />
          </Search.Icon>
        </Search.Indicator>
        <Search.Input class="flex size-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-neutral-11 disabled:cursor-not-allowed disabled:opacity-50" />
      </Search.Control>

      <Search.Portal>
        <Search.Content class="relative z-50 min-w-32 overflow-hidden rounded-md border bg-neutral-3 shadow-md">
          <Search.Listbox class="m-0 p-1" />
        </Search.Content>
      </Search.Portal>
    </Search>
  );
};
