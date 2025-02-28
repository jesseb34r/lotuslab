import { A } from "@solidjs/router";
import { For, Show } from "solid-js";

import { Link } from "@kobalte/core/link";

import { active_list } from "../index.tsx";

export function ListPage() {
  return (
    <div>
      <Link as={A} href="/">
        Home
      </Link>
      <Show when={active_list()}>
        {(list) => <For each={list().cards}>{(card) => <div>{card.card.name}</div>}</For>}
      </Show>
    </div>
  );
}
