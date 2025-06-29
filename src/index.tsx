/* @refresh reload */
import {
  type AccessorWithLatest,
  createAsync,
  Route,
  Router,
} from "@solidjs/router";
import {
  createContext,
  createSignal,
  type ParentComponent,
  Suspense,
  useContext,
} from "solid-js";
import { render } from "solid-js/web";

import "./styles/index.css";

import { AppHeader } from "./components/app_header";
import { get_all_unique_card_names } from "./lib/db";
import { NotFound } from "./pages/404";
import { HomePage } from "./pages/home_page";
import { ProjectPage } from "./pages/project_page";
import { SearchPage } from "./pages/search_page";
import { SettingsPage } from "./pages/settings_page";
import { ThemePreviewPage } from "./pages/theme_preview_page";

const UniqueCardNamesContext =
  createContext<
    AccessorWithLatest<
      | {
          name: string;
          oracle_id: string;
        }[]
      | undefined
    >
  >();
export const useUniqueCardNames = () => useContext(UniqueCardNamesContext);

const UniqueCardNamesProvider: ParentComponent = (props) => {
  const unique_card_names = createAsync(() => get_all_unique_card_names());

  return (
    <UniqueCardNamesContext.Provider value={unique_card_names}>
      {props.children}
    </UniqueCardNamesContext.Provider>
  );
};

const AppRoot: ParentComponent = (props) => {
  return (
    <div class="min-h-screen bg-neutral-1 text-neutral-12 select-none cursor-default">
      <AppHeader />
      <UniqueCardNamesProvider>
        <Suspense>{props.children}</Suspense>
      </UniqueCardNamesProvider>
    </div>
  );
};

// Global state. Probably change this later to a better structure.
export const [active_project_id, set_active_project_id] =
  createSignal<number>();

render(
  () => (
    <Router root={AppRoot}>
      <Route component={HomePage} path="/" />
      <Route component={ProjectPage} path="/project" />
      <Route component={SearchPage} path="/search" />
      <Route component={SettingsPage} path="/settings" />
      <Route component={ThemePreviewPage} path="/theme_preview" />
      <Route component={NotFound} path="*404" />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
