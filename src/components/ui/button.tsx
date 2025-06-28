import * as ButtonPrimitive from "@kobalte/core/button";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-neutral-1 transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        neutral: "bg-neutral-3 text-neutral-12 hover:bg-neutral-4",
        accent: "bg-accent-3 text-accent-12 hover:bg-accent-4",
        success: "bg-success-3 text-success-12 hover:bg-success-4",
        warning: "bg-warning-3 text-warning-12 hover:bg-warning-4",
        danger: "bg-danger-3 text-danger-12 hover:bg-danger-4",
        link: "text-neutral-12 underline-offset-4 hover:underline",
      },
      size: {
        default: "px-3 py-1.5",
        sm: "px-2 py-1 text-xs",
        lg: "px-5 py-3",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "default",
    },
  },
);
type ButtonProps<T extends ValidComponent = "button"> =
  ButtonPrimitive.ButtonRootProps<T> &
    VariantProps<typeof buttonVariants> & {
      class?: string | undefined;
      children?: JSX.Element;
    };

const Button = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ButtonProps<T>>,
) => {
  const [local, others] = splitProps(props as ButtonProps, [
    "variant",
    "size",
    "class",
  ]);
  return (
    <ButtonPrimitive.Root
      class={cn(
        buttonVariants({ variant: local.variant, size: local.size }),
        local.class,
      )}
      {...others}
    />
  );
};

export { Button, buttonVariants };
export type { ButtonProps };
