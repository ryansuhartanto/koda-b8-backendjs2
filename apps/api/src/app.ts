import express from "express";
import type { Express } from "express";

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
	res.send("Hello, World!");
});

app.use("/auth", authRouter);
app.use("/users", authMiddleware, userRouter);
app.use("/notes", authMiddleware, noteRouter);

export default app;
