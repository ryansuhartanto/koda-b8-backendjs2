import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import { Auth } from "#/Auth";
import LayoutApp from "#/pages/+Layout";

// oxlint-disable-next-line import/no-unassigned-import
import "#/style.css";

const root = document.querySelector("#app")!;
root.removeAttribute("hidden");

const router = createBrowserRouter([
	{
		path: "auth",
		Component: Auth,
	},
	{
		path: "/",
		Component: LayoutApp,
		children: [
			{
				index: true,
				Component: React.lazy(async () => import("#/pages/index")),
			},
			{
				path: "*",
				Component: React.lazy(async () => import("#/pages/index")),
			},
		],
	},
]);

createRoot(root).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
