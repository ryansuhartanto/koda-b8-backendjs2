import app from "#/app";

const port = 3000;

app.listen(port, () => {
	// oxlint-disable-next-line no-console
	console.log(`API listening on port ${port}`);
});
