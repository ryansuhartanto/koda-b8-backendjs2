import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import { App } from "#/App";
import { Auth } from "#/Auth";
import { Layout } from "#/Layout";

const root = document.querySelector("#app")!;
root.removeAttribute("hidden");

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{
				index: true,
				Component: App,
			},
			{
				path: "auth",
				Component: Auth,
			},
		],
	},
]);

createRoot(root).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
