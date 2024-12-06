import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { scriptEnvInjector } from "./scriptEnvInjectorPlugin";

const basePath = "/vitetr";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), scriptEnvInjector("config/app-config.json", basePath)],
  base: basePath,
  server: {
    port: 4173,
  },
});
