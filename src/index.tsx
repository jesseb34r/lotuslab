/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./index.css";

import { HomePage } from "./pages/home_page";
import { ListPage } from "./pages/list_page";
import type { ParentComponent } from "solid-js";

const AppLayout: ParentComponent = (props) => (
  <div class="min-h-screen bg-gray-app text-gray-normal">{props.children}</div>
);

render(
  () => (
    <Router root={AppLayout}>
      <Route path="/" component={HomePage} />
      <Route path="/list/:id" component={ListPage} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
