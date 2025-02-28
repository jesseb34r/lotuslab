import { Button, Separator } from "@kobalte/core";

import { test_cube_sorted } from "../../test-files/test_cube_sorted";
import { type Component, For, Show } from "solid-js";

export function ListPageOld() {
  type Card = {
    name: string;
    color: "W" | "U" | "B" | "R" | "G" | "M" | "C" | "L";
    cmc: number;
    type: "creature" | "planeswalker" | "instant" | "sorcery" | "enchantment" | "artifact" | "land";
  };

  const list = test_cube_sorted;

  const color_code_map = {
    W: "hsl(50, 100%, 80%, 0.2)",
    U: "hsl(220, 100%, 65%, 0.2)",
    B: "hsl(260, 40%, 50%, 0.2)",
    R: "hsl(0, 100%, 65%, 0.2)",
    G: "hsl(100, 100%, 65%, 0.2)",
    M: "hsl(50, 100%, 40%, 0.2)",
    C: "hsl(0, 0%, 70%, 0.2)",
    L: "hsl(20, 100%, 40%, 0.2)",
  };

  const color_name_map = {
    W: "White",
    U: "Blue",
    B: "Black",
    R: "Red",
    G: "Green",
    M: "Multicolor",
    C: "Colorless",
    L: "Lands",
  };

  const CardItem: Component<{ card: Card }> = (props) => (
    <Button.Root
      as={"li"}
      class="
        px-1.5 py-0.5 relative
        text-sm text-gray-11 hover:text-gray-12 dark:text-graydark-11 hover:dark:text-graydark-12
        overflow-ellipsis overflow-hidden whitespace-nowrap

        after:absolute after:content-[''] after:inset-0 after:bg-graya-4
      "
      style={{ background: color_code_map[props.card.color] }}
    >
      {props.card.name}
    </Button.Root>
  );

  const CardCostSection: Component<{ cards: Card[] }> = (props) => (
    <For each={props.cards}>{(card) => <CardItem card={card} />}</For>
  );

  const CardTypeSection: Component<{ cards: Card[][] }> = (props) => {
    const num_cards_in_section = () => {
      let total = 0;
      for (const sub_array of props.cards) {
        total += sub_array.length;
      }
      return total;
    };

    return (
      <ul class="border border-gray-8 dark:border-graydark-8 rounded overflow-hidden">
        <h3 class="text-center capitalize text-sm py-0.5 bg-gray-3 dark:bg-graydark-3">
          {`${props.cards[0][0].type} (${num_cards_in_section()})`}
        </h3>
        <For each={props.cards}>
          {(card_cost_section) => (
            <>
              <CardCostSection cards={card_cost_section} />
              <Show
                when={
                  num_cards_in_section() >= 5 &&
                  card_cost_section !== props.cards[props.cards.length - 1]
                }
              >
                <Separator.Root class="border-t-1 border-t-gray-8 dark:border-t-graydark-8" />
              </Show>
            </>
          )}
        </For>
      </ul>
    );
  };

  const CardColorColumn: Component<{ cards: Card[][][] }> = (props) => (
    <div class="max-w-40">
      <h2 class="text-center text-lg font-semibold mb-2.5">
        {color_name_map[props.cards[0][0][0].color]}
      </h2>
      <div class="rounded flex flex-col gap-2">
        <For each={props.cards}>
          {(card_type_section) => <CardTypeSection cards={card_type_section} />}
        </For>
      </div>
    </div>
  );

  return (
    <main class="flex flex-col pt-10 mx-auto w-[80%]">
      <header class="grid grid-cols-2 gap-4">
        <div>
          <h1 class="text-xl">List Name</h1>
          <div class="flex gap-4">
            <Button.Root class="bg-gray-action">settings</Button.Root>
            <Button.Root class="bg-gray-action">share</Button.Root>
          </div>
        </div>
        <div>
          <h2 class="text-lg">Description</h2>
          <p class="max-w-[40ch]">A short description of the list</p>
        </div>
      </header>

      <Separator.Root class="my-4 border-t-2 border-gray-6 dark:border-graydark-6" />

      <div class="flex gap-2 mx-auto">
        <For each={list.boards[0].cards as Card[][][][]}>
          {(card_color_section) => <CardColorColumn cards={card_color_section} />}
        </For>
      </div>
    </main>
  );
}
