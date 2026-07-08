import { defineConfig } from "vite";

export default defineConfig({
  // Relativer Base-Pfad, damit der Build unabhängig vom Deployment-Unterpfad
  // funktioniert (z. B. GitHub Pages unter /<repo-name>/).
  base: "./",
  test: {
    environment: "node",
  },
});
