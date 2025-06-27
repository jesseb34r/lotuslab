import { type ComponentProps, splitProps } from "solid-js";

import { cn } from "../lib/utils";

type IconProps = ComponentProps<"svg">;

const Icon = (props: IconProps) => {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={cn("size-4", props.class)}
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
