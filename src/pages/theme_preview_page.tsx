import { createSignal } from "solid-js";
import { Button } from "../components/ui/button";
import { Dialog } from "../components/ui/dialog";
import { TextField } from "../components/ui/text-field";

export function ThemePreviewPage() {
  const [dialog_open, set_dialog_open] = createSignal(false);

  return (
    <main class="p-margin flex flex-col gap-margin w-min mx-auto items-center">
      <h1 class="font-bold text-2xl">Button</h1>
      <div class="bg-neutral-2 p-4 rounded flex flex-col items-center">
        <h2 class="mb-2 font-semibold">Small</h2>
        <div class="flex gap-gutter justify-center">
          <Button variant="neutral" size="sm">
            Neutral
          </Button>
          <Button variant="accent" size="sm">
            Accent
          </Button>
          <Button variant="success" size="sm">
            Success
          </Button>
          <Button variant="warning" size="sm">
            Warning
          </Button>
          <Button variant="danger" size="sm">
            Danger
          </Button>
        </div>
        <h2 class="mb-2 font-semibold">Default</h2>
        <div class="flex gap-gutter justify-center">
          <Button variant="neutral">Neutral</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <h2 class="mb-2 font-semibold">Large</h2>
        <div class="flex gap-gutter justify-center">
          <Button variant="neutral" size="lg">
            Neutral
          </Button>
          <Button variant="accent" size="lg">
            Accent
          </Button>
          <Button variant="success" size="lg">
            Success
          </Button>
          <Button variant="warning" size="lg">
            Warning
          </Button>
          <Button variant="danger" size="lg">
            Danger
          </Button>
        </div>
      </div>
      <h1 class="font-bold text-2xl">Dialog</h1>
      <div class="bg-neutral-2 rounded flex flex-col items-center justify-center w-lg h-md">
        <Dialog open={dialog_open()} onOpenChange={set_dialog_open}>
          <Button onMouseDown={() => set_dialog_open(true)}>Trigger</Button>
          <Dialog.Content>
            <Dialog.CloseButtonX onMouseDown={() => set_dialog_open(false)} />
            <Dialog.Header>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>
                Ad Lorem consequat elit incididunt cillum.
              </Dialog.Description>
            </Dialog.Header>
            <div class="grid gap-gutter py-gutter">
              <TextField class="grid grid-cols-4 items-center gap-gutter">
                <TextField.Label class="text-right">
                  Project name
                </TextField.Label>
                <TextField.Input
                  value="Fundamentos"
                  class="col-span-3"
                  type="text"
                />
              </TextField>
              <TextField class="grid grid-cols-4 items-center gap-gutter">
                <TextField.Label class="text-right">
                  Description
                </TextField.Label>
                <TextField.Input
                  value="this is a description"
                  class="col-span-3"
                  type="text"
                />
              </TextField>
            </div>
            <Dialog.Footer>
              <Button
                variant="danger"
                onMouseDown={() => set_dialog_open(false)}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onMouseDown={() => set_dialog_open(false)}
              >
                Submit
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </div>
    </main>
  );
}
