/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./index.css";

import { HomePage } from "./pages/home_page";
import { ListPage } from "./pages/list_page";
import { createSignal, type ParentComponent } from "solid-js";
import type { CardList } from "./utils/card_list";

const AppLayout: ParentComponent = (props) => (
  <div class="min-h-screen bg-gray-app text-gray-normal">{props.children}</div>
);

// Global state. Probably change this later to a better structure.
export const [active_list, set_active_list] = createSignal<CardList>();

render(
  () => (
    <Router root={AppLayout}>
      <Route path="/" component={HomePage} />
      <Route path="/list" component={ListPage} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
