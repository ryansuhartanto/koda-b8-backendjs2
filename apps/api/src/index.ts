import app from "#/app";

const port = Number(process.env["API_PORT"] ?? "3000");

app.listen(port, () => {
	// oxlint-disable-next-line no-console
	console.log(`API listening on port ${port}`);
});
