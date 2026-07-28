import express from "express";

const app = express();
const port = 3000;

app.listen(port, () => {
	// oxlint-disable-next-line no-console
	console.log(`Example app listening on port ${port}`);
});
