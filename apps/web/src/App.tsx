import React from "react";

import { fetchApi } from "#/lib/api";

// oxlint-disable-next-line import/no-unassigned-import
import "#/main.css";

// oxlint-disable-next-line unicorn/prefer-top-level-await
const greeting = (async (): Promise<string> => {
	const req = await fetchApi("/");
	return req.text();
})();

function Greeting(): React.ReactNode {
	const text = React.use<string>(greeting);
	return <h1>{text}</h1>;
}

export function App(): React.ReactNode {
	return (
		<React.Suspense>
			<Greeting></Greeting>
		</React.Suspense>
	);
}
