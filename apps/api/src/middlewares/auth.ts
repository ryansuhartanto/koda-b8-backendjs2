import http2 from "node:http2";

import type { RequestHandler } from "express";

import * as Token from "#/lib/token";

type authHeader = {
	authorization: string;
};

export type AuthLocals = {
	idUser: number;
};

export const authMiddleware: RequestHandler = (req, res, next) => {
	const { authorization } = req.headers as Partial<authHeader>;
	const raw = authorization?.startsWith("Bearer ")
		? authorization.slice("Bearer ".length)
		: undefined;
	const idUser = raw ? Token.parse(raw) : undefined;

	if (!idUser) {
		res
			.status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
			.json({ error: "missing or invalid token" });
		return;
	}

	(res.locals as AuthLocals).idUser = idUser;

	next();
};
