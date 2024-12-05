import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { scriptEnvInjector } from "./scriptEnvInjectorPlugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), scriptEnvInjector()],
  base: "/vitetr-landing-page/",
  server: {
    port: 4173
  }
});
