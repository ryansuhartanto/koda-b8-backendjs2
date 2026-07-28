import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "#/App";

const root = document.querySelector("#app")!;

createRoot(root).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
