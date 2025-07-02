/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { createSignal, type ParentProps } from "solid-js";
import { render } from "solid-js/web";

import "./styles/index.css";

import { AppHeader } from "./components/app_header";
import { NotFound } from "./pages/404";
import { CardPage } from "./pages/card_page";
import { HomePage } from "./pages/home_page";
import { ProjectPage } from "./pages/project_page";
import { SearchPage } from "./pages/search_page";
import { SettingsPage } from "./pages/settings_page";
import { TestingPage } from "./pages/testing_page";
import { ThemePreviewPage } from "./pages/theme_preview_page";

function AppRoot(props: ParentProps) {
  return (
    <div class="min-h-screen bg-neutral-1 text-neutral-12 select-none cursor-default">
      <AppHeader />
      {props.children}
    </div>
  );
}

// Global state. Probably change this later to a better structure.
export const [active_project_id, set_active_project_id] =
  createSignal<number>();

render(
  () => (
    <Router root={AppRoot}>
      <Route component={HomePage} path="/" />
      <Route component={ProjectPage} path="/project" />
      <Route component={SearchPage} path="/search" />
      <Route component={CardPage} path="/card/:id" />
      <Route component={TestingPage} path="/testing" />
      <Route component={SettingsPage} path="/settings" />
      <Route component={ThemePreviewPage} path="/theme_preview" />
      <Route component={NotFound} path="*404" />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
