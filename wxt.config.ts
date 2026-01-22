import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  webExt: {
    startUrls: [
      "https://wxt.dev/guide/essentials/config/browser-startup.html",
      "https://github.com/aws/aws-sdk-js-v3/pull/7280",
    ],
  },
  manifest: {
    permissions: ["storage"],
  },
});
