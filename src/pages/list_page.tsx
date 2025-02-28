import { A } from "@solidjs/router";
import { active_list } from "../index.tsx";
import { For, Show } from "solid-js";

export function ListPage() {
  return (
    <div>
      <A href="/">Home</A>
      <Show when={active_list()}>
        {(list) => <For each={list().cards}>{(card) => <div>{card.card.name}</div>}</For>}
      </Show>
    </div>
  );
}
