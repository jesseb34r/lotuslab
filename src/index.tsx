/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { type ParentComponent, createSignal } from "solid-js";
import { render } from "solid-js/web";

import "./styles/index.css";

import { AppHeader } from "./components/app_header";
import { NotFound } from "./pages/404";
import { HomePage } from "./pages/home_page";
import { ProjectPage } from "./pages/project_page";
import { SearchPage } from "./pages/search_page";
import { SettingsPage } from "./pages/settings_page";
import { ThemePreviewPage } from "./pages/theme_preview_page";

const AppLayout: ParentComponent = (props) => (
  <div class="min-h-screen bg-neutral-1 text-neutral-12 select-none cursor-default">
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
      <Route path="/theme_preview" component={ThemePreviewPage} />
      <Route path="*404" component={NotFound} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
