import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  webExt: {
    startUrls: [
      "https://wxt.dev/guide/essentials/config/browser-startup.html",
      "https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Accueil_principal",
    ],
  },
  manifest: {
    permissions: ["storage"],
  },
});
