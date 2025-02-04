import { Dialog, TextField, ToggleGroup } from "@kobalte/core";
import { createSignal, Match, Switch } from "solid-js";

export function HomePage() {
  const [import_from, set_import_from] = createSignal<"blank" | "paste" | "file">("blank");

  return (
    <main class="flex flex-col pt-10 mx-auto w-[80%]">
      <h1 class="text-teal-10 text-4xl mb-6 text-center">Moxcel</h1>
      <div class="flex flex-col gap-2">
        <div class="flex gap-20 items-end justify-between">
          <h2 class="text-xl text-gray-dim">Decks</h2>
          <Dialog.Root>
            <Dialog.Trigger class="bg-grass-action px-2 py-1 rounded">New</Dialog.Trigger>
            <Dialog.Portal>
              {/* <Dialog.Overlay class="w-screen h-screen fixed top-[0] left-[0] bg-gray-ghost" /> */}
              <Dialog.Content class="fixed top-20 left-[50%] translate-x-[-50%] px-10 py-8 bg-gray-3 dark:bg-graydark-3 text-gray-normal flex flex-col items-center justify-center rounded gap-4">
                <Dialog.Title class="text-2xl mb-4">New List</Dialog.Title>
                <form class="flex flex-col items-stretch justify-center">
                  <label for="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    class="mb-4 bg-gray-7 dark:bg-graydark-7 px-1 rounded"
                  />
                  <div>
                    <ToggleGroup.Root
                      value={import_from()}
                      onChange={set_import_from}
                      class="flex gap-2 mb-4"
                    >
                      <ToggleGroup.Item
                        value="blank"
                        class="bg-gray-action data-pressed:bg-gray-8 dark:data-pressed:bg-graydark-8 px-2 py-1 rounded"
                      >
                        Blank
                      </ToggleGroup.Item>
                      <ToggleGroup.Item
                        value="paste"
                        class="bg-gray-action data-pressed:bg-gray-8 dark:data-pressed:bg-graydark-8 px-2 py-1 rounded"
                      >
                        Paste
                      </ToggleGroup.Item>
                      <ToggleGroup.Item
                        value="file"
                        class="bg-gray-action data-pressed:bg-gray-8 dark:data-pressed:bg-graydark-8 px-2 py-1 rounded"
                      >
                        Import File
                      </ToggleGroup.Item>
                    </ToggleGroup.Root>
                    <div class="mb-4">
                      <Switch>
                        <Match when={import_from() === "paste"}>
                          <TextField.Root class="flex flex-col">
                            <TextField.Label>Paste List</TextField.Label>
                            <TextField.TextArea class="bg-gray-7 dark:bg-graydark-7 px-1 rounded resize-none" />
                          </TextField.Root>
                        </Match>
                        <Match when={import_from() === "file"}>Import File</Match>
                      </Switch>
                    </div>
                  </div>
                  <button
                    type="submit"
                    value="submit"
                    class="bg-grass-action px-2 py-1 rounded self-end"
                  >
                    Create
                  </button>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
        <hr class="text-gray-dim" />
        <div>All my decks</div>
      </div>
    </main>
  );
}
