/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { createSignal, type ParentComponent } from "solid-js";

import "./index.css";

import { AppHeader } from "./components/app_header";
import { HomePage } from "./pages/home_page";
import { ProjectPage } from "./pages/project_page";
import { SearchPage } from "./pages/search_page";
import { SettingsPage } from "./pages/settings_page";
import { NotFound } from "./pages/404";

const AppLayout: ParentComponent = (props) => (
  <div class="min-h-screen bg-gray-app text-gray-normal select-none cursor-default">
    <AppHeader />
    {props.children}
  </div>
);

// Global state. Probably change this later to a better structure.
export const [active_project_id, set_active_project_id] =
  createSignal<number>();

render(
  () => (
    <Router root={AppLayout}>
      <Route path="/" component={HomePage} />
      <Route path="/project" component={ProjectPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="*404" component={NotFound} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
