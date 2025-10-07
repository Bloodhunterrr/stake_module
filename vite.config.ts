import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import { lingui } from "@lingui/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["@lingui/babel-plugin-lingui-macro"],
      },
    }),
    tailwindcss(),
    svgr(),
    lingui(),
  ],
    server: {
        port: 4444,
        host: true
    },
    preview: {
        port: 4444
    },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
