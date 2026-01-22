import "../styled-system/styles.css";
import ReactDOM from "react-dom/client";
import HoverLogic from "@/components/hover-logic";
import React from "react";
import '@fontsource-variable/geist-mono';

export default defineContentScript({
  matches: ["<all_urls>"],

  // 2. Set cssInjectionMode
  cssInjectionMode: "ui",

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: "read-it-fast-ui",
      position: "inline",
      anchor: "body",
      onMount: (container) => {
        // Container is a body, and React warns when creating a root on the body, so create a wrapper div
        const app = document.createElement("div");
        container.append(app);

        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(app);

        root.render(
          <React.StrictMode>
            <HoverLogic />
          </React.StrictMode>
        );
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount();
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});
