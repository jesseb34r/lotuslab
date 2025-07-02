import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [solid(), tsconfigPaths(), tailwindcss()],
});
