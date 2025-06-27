import { createAsync, query, useNavigate } from "@solidjs/router";
import { For, Show, Suspense, createResource, createSignal } from "solid-js";

import { Select } from "@kobalte/core/select";
import {
  type ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";

import { Button } from "../components/ui/button";
import { Dialog } from "../components/ui/dialog";
import { Table } from "../components/ui/table.tsx";
import { TextField } from "../components/ui/text-field";
import { active_project_id, set_active_project_id } from "../index.tsx";
import {
  MoxcelDatabase,
  type ProjectMetadata,
  project_format_options,
} from "../lib/db.ts";

const get_project_list = query(async () => {
  const db = await MoxcelDatabase.db();
  return db.get_project_list();
}, "get_project_list");

const columns: ColumnDef<ProjectMetadata>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "format",
    header: "Format",
  },
];

const ProjectTable = (props: {
  columns: ColumnDef<ProjectMetadata>[];
  data: ProjectMetadata[];
}) => {
  const table = createSolidTable({
    get data() {
      return props.data;
    },
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const navigate = useNavigate();

  return (
    <div class="rounded-md border">
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
                onMouseDown={() => {
                  set_active_project_id(row.original.id);
                  navigate("/project");
                }}
                data-state={row.getIsSelected() && "selected"}
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
    </div>
  );
};

export function HomePage() {
  const [new_project_dialog_open, set_new_project_dialog_open] =
    createSignal(false);

  const projects = createAsync(() => get_project_list());

  const navigate = useNavigate();

  const NewProjectDialog = () => {
    const [project_name, set_project_name] = createSignal("");
    const [project_format, set_project_format] =
      createSignal<ProjectMetadata["format"]>("list");

    const handle_new_project = async () => {
      const db = await MoxcelDatabase.db();
      const project_id = await db.create_project(
        project_name(),
        project_format(),
      );

      set_active_project_id(project_id);
      navigate("/project", { replace: true });
    };

    return (
      <Dialog
        open={new_project_dialog_open()}
        onOpenChange={set_new_project_dialog_open}
      >
        <Button
          onMouseDown={() => set_new_project_dialog_open(true)}
          variant="success"
        >
          New
        </Button>
        <Dialog.Content>
          <Dialog.CloseButtonX
            onMouseDown={() => set_new_project_dialog_open(false)}
          />
          <Dialog.Header>
            <Dialog.Title>New Project</Dialog.Title>
          </Dialog.Header>
          <TextField value={project_name()} onChange={set_project_name}>
            <TextField.Label>Name</TextField.Label>
            <TextField.Input />
          </TextField>
          <Select
            value={project_format()}
            onChange={set_project_format}
            options={[...project_format_options]}
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
          <Button onMouseDown={handle_new_project} variant="success">
            Create
          </Button>
        </Dialog.Content>
      </Dialog>
    );
  };

  return (
    <main class="flex flex-col pt-10 mx-auto w-[80%]">
      <div class="flex flex-col gap-2">
        {/* Header */}
        <div>
          <h1 class="text-4xl mb-margin">Projects</h1>
          <div class="flex justify-between">
            <div class="flex gap-margin items-center">
              <NewProjectDialog />
              <Button>New Folder</Button>
            </div>
            <div class="flex gap-margin items-center">
              <Button>Search</Button>
              <Button>Sort</Button>
            </div>
          </div>
        </div>
        <hr class="text-gray-dim" />

        {/* Projects */}
        {/* <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <Suspense>
            <For each={projects}>
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
                      handle_delete_project(project.id);
                    }}
                  >
                    ×
                  </Button>
                </Button>
              )}
            </For>
          </Suspense>
        </div> */}
        <Show when={projects()}>
          {(safe_projects) => (
            <ProjectTable data={safe_projects()} columns={columns} />
          )}
        </Show>
      </div>
    </main>
  );
}
