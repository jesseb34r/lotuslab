/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./index.css";

import { AppHeader } from "./components/app_header";
import { HomePage } from "./pages/home_page";
import { ProjectPage } from "./pages/project_page";
import { NotFound } from "./pages/404";
import { createSignal, type ParentComponent } from "solid-js";
import type { Project } from "./lib/project";

const AppLayout: ParentComponent = (props) => (
  <div class="min-h-screen bg-gray-app text-gray-normal">
    <AppHeader />
    {props.children}
  </div>
);

// Global state. Probably change this later to a better structure.
export const [active_project, set_active_project] = createSignal<Project>();

render(
  () => (
    <Router root={AppLayout}>
      <Route path="/" component={HomePage} />
      <Route path="/project" component={ProjectPage} />
      <Route path="*404" component={NotFound} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
