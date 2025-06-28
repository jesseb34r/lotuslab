import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../lib/utils";

type IconProps = ComponentProps<"svg">;

const Icon = (props: IconProps) => {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <svg
      class={cn("size-4", props.class)}
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      {...rest}
    />
  );
};

export const IconPlus = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Icon>
);

export const IconX = (props: IconProps) => (
  <Icon {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Icon>
);
