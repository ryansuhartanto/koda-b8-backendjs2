import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

export default defineConfig({
	clearScreen: false,

	plugins: [react()],
});
