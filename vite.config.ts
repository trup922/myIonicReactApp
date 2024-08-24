import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const customHmr: Plugin = {
  name: "custom-hmr",
  enforce: "post",
  handleHotUpdate({ file, server }) {
    if (file.endsWith(".js")) {
      server.ws.send({ type: "full-reload" });
      return [];
    }
  },
};

const logPlugin: Plugin = {
  name: "log-plugin",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      console.log(`Request: ${req.url}`);
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), customHmr, logPlugin],
  base: "./",
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "build",
    rollupOptions: {
      external: ["/static/js/main.6e49a396.js"],
    },
  },
  optimizeDeps: {
    exclude: ["main.6e49a396.js"],
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
