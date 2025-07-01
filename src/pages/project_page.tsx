import { createAsync, useAction } from "@solidjs/router";
import { createSolidTable, flexRender } from "@tanstack/solid-table";
import {
  type ColumnDef,
  createColumnHelper,
  getCoreRowModel,
} from "@tanstack/table-core";
import { type Component, createSignal, For, Show, Suspense } from "solid-js";
import { Portal } from "solid-js/web";
import { IconPencil, IconPlus, IconX } from "../components/icons.tsx";
import { Button } from "../components/ui/button";
import { Dialog } from "../components/ui/dialog";
import { Table } from "../components/ui/table.tsx";
import { TextField } from "../components/ui/text-field";
import { active_project_id } from "../index.tsx";
import {
  action_add_cards_to_list,
  action_remove_card_from_list,
  action_update_project_metadata,
  type Card,
  type CardMetadata,
  find_versions_by_exact_name,
  get_full_cards_in_list,
  get_lists_by_project,
  get_project_by_id,
} from "../lib/db";

const column_helper = createColumnHelper<{
  metadata: CardMetadata;
  card: Card;
}>();
const card_columns: ColumnDef<
  { metadata: CardMetadata; card: Card },
  string | null | undefined
>[] = [
  column_helper.accessor("card.name", {
    header: "Name",
  }),
  column_helper.accessor("card.mana_cost", {
    header: "Mana Cost",
  }),
  {
    id: "delete",
    cell: (props) => {
      const delete_card = useAction(action_remove_card_from_list);
      return (
        <Button
          onMouseDown={(e) => {
            e.stopPropagation();
            delete_card(
              props.row.original.metadata.id,
              props.row.original.metadata.list_id,
            );
          }}
          size="icon"
          variant="danger"
        >
          <IconX />
        </Button>
      );
    },
  },
];

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
        <ul class="list-disc list-inside space-y-1">
          <Suspense>
            <Show when={lists()}>
              {(all_lists) => {
                return (
                  <Suspense>
                    <For each={all_lists()}>
                      {(list) => {
                        const cards = createAsync(() =>
                          get_full_cards_in_list(list.id),
                        );
                        return (
                          <>
                            <div class="flex mb-margin mt-gutter justify-between items-baseline">
                              <h2 class="font-bold">{list.name}</h2>
                              <AddCardsDialog list_id={list.id} />
                            </div>
                            <div>
                              <ul>
                                <Suspense>
                                  <Show when={cards()}>
                                    {(safe_cards) => (
                                      <CardTable
                                        columns={card_columns}
                                        data={safe_cards()}
                                      />
                                    )}
                                  </Show>
                                </Suspense>
                              </ul>
                            </div>
                          </>
                        );
                      }}
                    </For>
                  </Suspense>
                );
              }}
            </Show>
          </Suspense>
        </ul>
      </Suspense>
    </main>
  );
}

function AddCardsDialog(props: { list_id: number }) {
  const [dialog_open, set_dialog_open] = createSignal(false);
  const [card_list_text, set_card_list_text] = createSignal("");

  const add_cards_to_list = useAction(action_add_cards_to_list);

  function handle_open() {
    set_dialog_open(true);
    set_card_list_text("");
  }

  async function handle_add_cards() {
    const card_ids = await parse_pasted_cards_to_ids(card_list_text());
    add_cards_to_list(props.list_id, card_ids);
    set_dialog_open(false);
  }

  // TODO: move this function to a more appropriate spot
  async function parse_pasted_cards_to_ids(
    pasted_cards: string,
  ): Promise<string[]> {
    const lines = pasted_cards
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    const card_ids: string[] = [];

    for (const line of lines) {
      // Check if the line has a quantity prefix like "4x Card Name"
      const match = line.match(/^(\d+)(?:x\s*|\s+)(.+)$/i);

      if (match) {
        const quantity = Math.max(1, Number.parseInt(match[1]));
        const card_name = match[2].trim();

        const all_versions = await find_versions_by_exact_name(card_name);
        card_ids.push(all_versions[0].id);
      } else {
        const all_versions = await find_versions_by_exact_name(line.trim());
        if (all_versions && all_versions.length > 0) {
          card_ids.push(all_versions[0].id); // use first printing
        }
      }
    }

    return card_ids;
  }

  return (
    <Dialog onOpenChange={set_dialog_open} open={dialog_open()}>
      <Button onMouseDown={handle_open} size="icon" variant="success">
        <IconPlus />
      </Button>
      <Dialog.Content
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handle_add_cards();
          }
        }}
      >
        <Dialog.CloseButtonX onMouseDown={() => set_dialog_open(false)} />
        <Dialog.Header>
          <Dialog.Title>Add Cards</Dialog.Title>
        </Dialog.Header>
        <div class="flex flex-col items-stretch gap-4">
          <TextField onChange={set_card_list_text} value={card_list_text()}>
            <TextField.Label>Paste Card List</TextField.Label>
            <TextField.TextArea placeholder="Paste cards here, one per line..." />
          </TextField>
          <Button onMouseDown={handle_add_cards} variant="success">
            Add Cards
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

function CardTable(props: {
  columns: ColumnDef<
    { metadata: CardMetadata; card: Card },
    string | null | undefined
  >[];
  data: { metadata: CardMetadata; card: Card }[];
}) {
  const table = createSolidTable({
    columns: props.columns,
    get data() {
      return props.data;
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const [preview_show, set_preview_show] = createSignal(false);
  const [preview_ref, set_preview_ref] = createSignal<HTMLImageElement>();
  const [preview_offset, set_preview_offset] = createSignal({ x: 0, y: 0 });
  const [preview_img_uri, set_preview_img_uri] = createSignal("");

  function handle_set_preview(e: MouseEvent, card_img_uri: string) {
    const offsetX =
      e.x + preview_ref()!.getBoundingClientRect().width > window.innerWidth
        ? window.innerWidth - preview_ref()!.getBoundingClientRect().width
        : e.x + 5;
    const offsetY =
      e.y + preview_ref()!.getBoundingClientRect().height > window.innerHeight
        ? window.innerHeight - preview_ref()!.getBoundingClientRect().height
        : e.y + 10;
    set_preview_offset({ x: offsetX, y: offsetY });
    set_preview_img_uri(card_img_uri);
  }

  function CardPreview() {
    return (
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
  }

  return (
    <>
      <Table>
        <Table.Header>
          <For each={table.getHeaderGroups()}>
            {(header_group) => (
              <Table.Row>
                <For each={header_group.headers}>
                  {(header) => (
                    <Table.Head colSpan={header.colSpan}>
                      <Show when={!header.isPlaceholder}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </Show>
                    </Table.Head>
                  )}
                </For>
              </Table.Row>
            )}
          </For>
        </Table.Header>
        <Table.Body>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <Table.Row
                onMouseEnter={() => set_preview_show(true)}
                onMouseLeave={() => set_preview_show(false)}
                onMouseMove={(e) =>
                  handle_set_preview(e, row.original.card.image_uri!)
                }
              >
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <Table.Cell>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  )}
                </For>
              </Table.Row>
            )}
          </For>
        </Table.Body>
      </Table>
      <CardPreview />
    </>
  );
}
