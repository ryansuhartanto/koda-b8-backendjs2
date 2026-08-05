import http2 from "node:http2";

import { apiReference } from "@scalar/express-api-reference";
import express from "express";
import type { ErrorRequestHandler, Express } from "express";

import { openapi } from "#/lib/openapi";
import { authMiddleware } from "#/middlewares/auth";
import { corsMiddleware } from "#/middlewares/cors";
import { authRouter } from "#/routes/auth.route";
import { noteRouter } from "#/routes/note.route";
import { userRouter } from "#/routes/user.route";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(corsMiddleware);

app.get("/", (_req, res) => {
	res.redirect(http2.constants.HTTP_STATUS_MOVED_PERMANENTLY, "/docs");
});

app.get("/openapi.json", (_req, res) => {
	res.json(openapi);
});

app.use(
	"/docs",
	apiReference({ url: "/openapi.json", pageTitle: "Notes API" }),
);

app.use("/auth", authRouter);
app.use("/users", authMiddleware, userRouter);
app.use("/notes", authMiddleware, noteRouter);

// express 5 forwards rejected handlers here; without it a failed query answers in HTML
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
	res
		.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
		.json({ error: (error as Error).message });
};

app.use(errorHandler);

export default app;
