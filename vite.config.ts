/* eslint-disable no-undef */
import { defineConfig } from "vite";
import { resolve } from 'pathe'

const libName = "storyblok-js";

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "storyblok",
        fileName: (format) =>
          format === "es" ? `${libName}.mjs` : `${libName}.js`,
      },
    },
    test: {
      setupFiles: ["./src/tests/setup.js"],
    },
    define: {
      "process.env": {
        npm_package_version: process.env.npm_package_version,
      },
    },
  };
});
