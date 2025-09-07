import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: "/lawn-rescue/",
// });

export default defineConfig({
  base: "/lawn-rescue/", // Replace with your actual GitHub repo name
  build: {
    outDir: "dist",
  },
});
