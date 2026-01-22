import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./entrypoints/**/*.{js,jsx,ts,tsx}",
  ],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      semanticTokens: {
        colors: {
          bg: {
            DEFAULT: {
              value: {
                base: "#FFFFFF",
                _osDark: "#000000",
              },
            },
            muted: {
              value: {
                base: "#F5F5F5",
                _osDark: "#1A1A1A",
              },
            },
          },
          fg: {
            DEFAULT: {
              value: {
                base: "#000000",
                _osDark: "#FFFFFF",
              },
            },
            muted: {
              value: {
                base: "#666666",
                _osDark: "#999999",
              },
            },
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
