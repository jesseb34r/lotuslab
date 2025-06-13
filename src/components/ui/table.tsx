import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "../../lib/utils";

const Root: Component<ComponentProps<"table">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div class="relative w-full overflow-auto">
      <table
        class={cn("w-full caption-bottom text-sm", local.class)}
        {...others}
      />
    </div>
  );
};

const Header: Component<ComponentProps<"thead">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <thead class={cn("[&_tr]:border-b", local.class)} {...others} />;
};

const Body: Component<ComponentProps<"tbody">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <tbody class={cn("[&_tr:last-child]:border-0", local.class)} {...others} />
  );
};

const Footer: Component<ComponentProps<"tfoot">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <tfoot
      class={cn("bg-neutral-3 font-medium text-neutral-12", local.class)}
      {...others}
    />
  );
};

const Row: Component<ComponentProps<"tr">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <tr
      class={cn(
        "border-b hover:bg-neutral-2 data-[state=selected]:bg-neutral-3",
        local.class,
      )}
      {...others}
    />
  );
};

const Head: Component<ComponentProps<"th">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <th
      class={cn(
        "h-10 px-2 text-left align-middle font-medium text-neutral-11 [&:has([role=checkbox])]:pr-0",
        local.class,
      )}
      {...others}
    />
  );
};

const Cell: Component<ComponentProps<"td">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <td
      class={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0", local.class)}
      {...others}
    />
  );
};

const Caption: Component<ComponentProps<"caption">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <caption
      class={cn("mt-4 text-sm text-neutral-11", local.class)}
      {...others}
    />
  );
};

export const Table = Object.assign(Root, {
  Header,
  Body,
  Footer,
  Head,
  Row,
  Cell,
  Caption,
});
