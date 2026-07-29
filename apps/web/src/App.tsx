import { M3eCard } from "@m3e/react/card";
import { M3eTheme } from "@m3e/react/theme";
import React from "react";

import { Layout } from "#/Layout";
import { fetchApi } from "#/lib/api";

// oxlint-disable-next-line import/no-unassigned-import
import "#/style.css";

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
		<M3eTheme
			color="#FBBC04"
			variant="expressive"
		>
			<Layout>
				<React.Suspense>
					<M3eCard variant="outlined">
						<div slot="content">
							<Greeting />
						</div>
					</M3eCard>
				</React.Suspense>
			</Layout>
		</M3eTheme>
	);
}
