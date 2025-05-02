import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    port: 5173, // Change the port if needed
    open: true, // Automatically open the browser
    hmr: {
      protocol: 'ws', // WebSocket for HMR
      host: 'localhost',
    },
  }
});
