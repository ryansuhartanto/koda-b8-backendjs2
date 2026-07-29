import http2 from "node:http2";

import type { RequestHandler } from "express";

type authHeader = {
	authorization: string;
};

export const authMiddleware: RequestHandler = (req, res, next) => {
	const { authorization } = req.headers as Partial<authHeader>;

	if (authorization !== "hello") {
		res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).end();
		return;
	}

	next();
};
