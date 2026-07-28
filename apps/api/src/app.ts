import express from "express";
import type { Express } from "express";

import { corsMiddleware } from "#/middleware/cors";

const app: Express = express();

app.use(corsMiddleware);

app.use("/", (_req, res) => {
	res.send("Hello, World!");
	res.end();
});

export default app;
