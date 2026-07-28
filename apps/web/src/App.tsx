import React from "react";

// oxlint-disable-next-line unicorn/prefer-top-level-await
const greeting = (async (): Promise<string> => {
	const req = await fetch("http://localhost:3000/");
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
