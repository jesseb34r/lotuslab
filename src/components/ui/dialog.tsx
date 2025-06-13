import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { Button as ButtonPrimitive } from "@kobalte/core/button";
import * as DialogPrimitive from "@kobalte/core/dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "../../lib/utils";

const Root = DialogPrimitive.Root;

type DialogCloseButtonXProps<T extends ValidComponent = "button"> =
  DialogPrimitive.DialogCloseButtonProps<T> & { class?: string | undefined };

const CloseButtonX = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, DialogCloseButtonXProps<T>>,
) => {
  const [, rest] = splitProps(props as DialogCloseButtonXProps, ["class"]);
  return (
    <ButtonPrimitive
      class={cn(
        "absolute right-margin top-margin rounded-sm text-neutral-11 hover:text-neutral-12 disabled:pointer-events-none",
        props.class,
      )}
      {...rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
      >
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
      <span class="sr-only">Close</span>
    </ButtonPrimitive>
  );
};

const Portal: Component<DialogPrimitive.DialogPortalProps> = (props) => {
  const [, rest] = splitProps(props, ["children"]);
  return (
    <DialogPrimitive.Portal {...rest}>
      <div class="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
        {props.children}
      </div>
    </DialogPrimitive.Portal>
  );
};

type DialogOverlayProps<T extends ValidComponent = "div"> =
  DialogPrimitive.DialogOverlayProps<T> & { class?: string | undefined };

const Overlay = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogOverlayProps<T>>,
) => {
  const [, rest] = splitProps(props as DialogOverlayProps, ["class"]);
  return (
    <DialogPrimitive.Overlay
      class={cn("fixed inset-0 z-50 bg-overlay-10", props.class)}
      {...rest}
    />
  );
};

type DialogContentProps<T extends ValidComponent = "div"> =
  DialogPrimitive.DialogContentProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const Content = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogContentProps<T>>,
) => {
  const [, rest] = splitProps(props as DialogContentProps, ["class"]);
  return (
    <Portal>
      <Overlay />
      <DialogPrimitive.Content
        class={cn(
          "fixed left-1/2 top-1/2 z-50 grid max-h-screen w-full max-w-2xl -translate-x-1/2 -translate-y-3/4 gap-4 overflow-y-auto border-2 border-neutral-7 bg-neutral-3 text-neutral-12 p-gutter shadow-lg sm:rounded-lg",
          props.class,
        )}
        {...rest}
      />
    </Portal>
  );
};

const Header: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        props.class,
      )}
      {...rest}
    />
  );
};

const Footer: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <div class={cn("flex flex-row justify-between", props.class)} {...rest} />
  );
};

type DialogTitleProps<T extends ValidComponent = "h2"> =
  DialogPrimitive.DialogTitleProps<T> & {
    class?: string | undefined;
  };

const Title = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, DialogTitleProps<T>>,
) => {
  const [, rest] = splitProps(props as DialogTitleProps, ["class"]);
  return (
    <DialogPrimitive.Title
      class={cn(
        "text-lg font-semibold leading-none tracking-tight",
        props.class,
      )}
      {...rest}
    />
  );
};

type DialogDescriptionProps<T extends ValidComponent = "p"> =
  DialogPrimitive.DialogDescriptionProps<T> & {
    class?: string | undefined;
  };

const Description = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, DialogDescriptionProps<T>>,
) => {
  const [, rest] = splitProps(props as DialogDescriptionProps, ["class"]);
  return (
    <DialogPrimitive.Description
      class={cn("text-sm text-neutral-11", props.class)}
      {...rest}
    />
  );
};

export const Dialog = Object.assign(Root, {
  CloseButtonX,
  Content,
  Header,
  Footer,
  Title,
  Description,
});
