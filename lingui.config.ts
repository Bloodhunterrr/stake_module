import { defineConfig } from "@lingui/cli";
import { ALLOWED_LANGUAGES } from "./src/types/lang";

export default defineConfig({
  sourceLocale: "en",
  locales: Object.keys(ALLOWED_LANGUAGES),
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
});