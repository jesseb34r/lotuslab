import { For, Show, createSignal } from "solid-js";
import { Button } from "@kobalte/core";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import type { ScryfallColors, ScryfallImageUris } from "@scryfall/api-types";
import { Portal } from "solid-js/web";

type Card = {
  quantity: number;
  name: string;
  colors: ScryfallColors;
  image_uris: ScryfallImageUris;
};

const getFilePath = async () => {
  return await open({
    multiple: false,
    directory: false,
  });
};

const parseCardList = async (path: string): Promise<Card[] | undefined> => {
  const response: string = await invoke("parse_card_file", { path });

  if (response === "Error") {
    console.error("Error parsing file");
    return undefined;
  }

  return JSON.parse(response);
};

export const ImportListComponent = () => {
  const [loaded, setLoaded] = createSignal(false);
  const [cardList, setCardList] = createSignal<Card[]>();
  const [previewOffset, setPreviewOffset] = createSignal({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = createSignal(false);
  const [previewImgUri, setPreviewImgUri] = createSignal("");
  const [previewRef, setPreviewRef] = createSignal<HTMLImageElement>();

  const handleImportClick = async () => {
    const filePath = await getFilePath();

    if (filePath) {
      setLoaded(true);
      const result = await parseCardList(filePath);

      if (result instanceof Error) {
        console.error(result);
        return;
      }

      console.log(result);
      setCardList(result);
    }
  };

  const handleSetPreview = (e: MouseEvent, card: Card) => {
    const offsetX =
      e.x + previewRef()!.getBoundingClientRect().width > window.innerWidth
        ? window.innerWidth - previewRef()!.getBoundingClientRect().width
        : e.x + 5;
    const offsetY =
      e.y + previewRef()!.getBoundingClientRect().height > window.innerHeight
        ? window.innerHeight - previewRef()!.getBoundingClientRect().height
        : e.y + 10;
    setPreviewOffset({ x: offsetX, y: offsetY });
    setPreviewImgUri(card.image_uris.normal);
  };

  return (
    <main id="main" class="flex min-h-screen justify-center bg-neutral-700 p-20">
      <Show
        when={loaded()}
        fallback={
          <Button.Root
            onClick={() => handleImportClick()}
            class="inline-flex h-10 content-center items-center rounded bg-blue-600 px-2 py-1 text-neutral-50 outline-none transition duration-75 hover:bg-blue-500 focus-visible:outline-offset-1 focus-visible:outline-blue-500 active:bg-blue-400"
          >
            Import File
          </Button.Root>
        }
      >
        <div class="w-full flex-grow whitespace-pre-wrap rounded bg-neutral-600 px-2 py-1">
          <ul class="flex flex-col items-start">
            <For each={cardList()}>
              {(card) => (
                <li
                  onMouseMove={(e) => handleSetPreview(e, card)}
                  onMouseOver={() => setShowPreview(true)}
                  onFocus={() => {}}
                  onMouseLeave={() => setShowPreview(false)}
                  class="cursor-pointer"
                >
                  {`${card.quantity} ${card.name}`}
                </li>
              )}
            </For>
          </ul>
        </div>
        <Button.Root
          onClick={() => setLoaded(false)}
          class="inline-flex h-10 content-center items-center rounded bg-blue-600 px-2 py-1 text-neutral-50 outline-none transition duration-75 hover:bg-blue-500 focus-visible:outline-offset-1 focus-visible:outline-blue-500 active:bg-blue-400"
        >
          Reset
        </Button.Root>
        <Show when={showPreview()}>
          <Portal>
            <img
              ref={setPreviewRef}
              class="fixed aspect-[5/7] h-80 rounded-xl"
              style={{
                left: `${previewOffset()!.x}px`,
                top: `${previewOffset()!.y}px`,
                "pointer-events": "none",
              }}
              src={previewImgUri()}
              alt="card preview"
            />
          </Portal>
        </Show>
      </Show>
    </main>
  );
};
