import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite-plus";

export default defineConfig(({ mode }) => {
	const envDir = "../..";
	const env = loadEnv(mode, envDir, "");

	return {
		clearScreen: false,

		envDir,
		plugins: [react(), tailwindcss()],

		server: {
			host: true,
			port: Number(env["WEB_PORT"] ?? "5173"),
			strictPort: true,
		},
		preview: {
			port: Number(env["WEB_PORT"] ?? "4173"),
		},
	};
});
