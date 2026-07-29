import { globSync } from "node:fs";

import oxfmt from "@kekkon-nexus/config/oxfmt";
import oxlint from "@kekkon-nexus/config/oxlint";
import { defineConfig } from "vite-plus";

import pkg from "#/package.json" with { type: "json" };

export default defineConfig({
	fmt: {
		...oxfmt,
		ignorePatterns: ["aube-lock.yaml"],

		overrides: [
			{
				files: ["*.css"],
				options: {
					printWidth: 320,
				},
			},
		],
	},
	lint: {
		extends: [oxlint],
		jsPlugins: [
			{
				name: "vite-plus",
				specifier: "vite-plus/oxlint-plugin",
			},
			{
				name: "no-relative-import-paths",
				specifier: "eslint-plugin-no-relative-import-paths",
			},
		],

		rules: {
			"vite-plus/prefer-vite-plus-imports": "error",
			"no-relative-import-paths/no-relative-import-paths": [
				"warn",
				{ allowSameFolder: false, rootDir: `/src`, prefix: "#" },
			],
		},

		ignorePatterns: ["apps/web/src/components/ui"],

		overrides: pkg.workspaces
			.flatMap((glob) => globSync(glob))
			.map((dir) => ({
				files: [`${dir}/**`],
				rules: {
					"no-relative-import-paths/no-relative-import-paths": [
						"warn",
						{
							allowSameFolder: false,
							rootDir: `${dir}/src`,
							prefix: "#",
						},
					],
				},
			})),
	},
	staged: {
		"*": "vp check --fix --no-error-on-unmatched-pattern",
	},
});
