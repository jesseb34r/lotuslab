import { Select } from "@kobalte/core/select";
import { createAsync, useAction, useNavigate } from "@solidjs/router";
import {
  type ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { createSignal, For, Show } from "solid-js";

import { IconPlus } from "../components/icons.tsx";
import { Button } from "../components/ui/button";
import { Dialog } from "../components/ui/dialog";
import { Table } from "../components/ui/table.tsx";
import { TextField } from "../components/ui/text-field";
import { set_active_project_id } from "../index.tsx";
import {
  action_create_project,
  get_projects,
  type ProjectMetadata,
  project_format_options,
} from "../lib/db.ts";

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

export function HomePage() {
  // Now projects is a resource function that calls the db query
  const projects = createAsync(async () => get_projects());

  return (
    <main class="flex flex-col pt-10 mx-auto w-[80%]">
      {/* Header */}
      <div class="flex justify-between mb-margin">
        <h1 class="text-4xl">Projects</h1>
        <NewProjectDialog />
      </div>

      {/* Projects */}
      <Show when={projects()}>
        {(safe_projects) => (
          <ProjectTable columns={columns} data={safe_projects()} />
        )}
      </Show>
    </main>
  );
}

const NewProjectDialog = () => {
  const [dialog_open, set_dialog_open] = createSignal(false);
  const [project_name, set_project_name] = createSignal("");
  const [project_format, set_project_format] =
    createSignal<ProjectMetadata["format"]>("list");

  const navigate = useNavigate();
  const create_project = useAction(action_create_project);

  const handle_new_project = async () => {
    const project_id = await create_project(project_name());

    set_active_project_id(project_id);
    navigate("/project", { replace: true });
  };

  return (
    <Dialog onOpenChange={set_dialog_open} open={dialog_open()}>
      <Button
        onMouseDown={() => set_dialog_open(true)}
        size="icon"
        variant="success"
      >
        <IconPlus />
      </Button>
      <Dialog.Content>
        <Dialog.CloseButtonX onMouseDown={() => set_dialog_open(false)} />
        <Dialog.Header>
          <Dialog.Title>New Project</Dialog.Title>
        </Dialog.Header>
        <TextField onChange={set_project_name} value={project_name()}>
          <TextField.Label>Name</TextField.Label>
          <TextField.Input />
        </TextField>
        <Select
          itemComponent={(props) => (
            <Select.Item
              class="px-4 py-2 cursor-pointer data-highlighted:bg-neutral-5"
              item={props.item}
            >
              <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
              <Select.ItemIndicator>⋅</Select.ItemIndicator>
            </Select.Item>
          )}
          onChange={set_project_format}
          options={[...project_format_options]}
          value={project_format()}
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

const ProjectTable = (props: {
  columns: ColumnDef<ProjectMetadata>[];
  data: ProjectMetadata[];
}) => {
  const table = createSolidTable({
    columns: props.columns,
    get data() {
      return props.data;
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const navigate = useNavigate();

  return (
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
              data-state={row.getIsSelected() && "selected"}
              onMouseDown={() => {
                set_active_project_id(row.original.id);
                navigate("/project");
              }}
            >
              <For each={row.getVisibleCells()}>
                {(cell) => (
                  <Table.Cell>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                )}
              </For>
            </Table.Row>
          )}
        </For>
      </Table.Body>
    </Table>
  );
};
