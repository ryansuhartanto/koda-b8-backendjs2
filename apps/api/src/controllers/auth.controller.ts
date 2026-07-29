import http2 from "node:http2";

import type { RequestHandler } from "express";

import * as User from "#/models/user.model";

type authRequest = {
	name: string;
	email: string;
	password: string;
};

export const register: RequestHandler = async (req, res) => {
	const { name, email, password } = req.body as Partial<authRequest>;

	if (!name || !email || !password) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "name, email and password are required" });
		return;
	}

	if (await User.findByEmail(email)) {
		res
			.status(http2.constants.HTTP_STATUS_CONFLICT)
			.json({ error: "email already registered" });
		return;
	}

	res
		.status(http2.constants.HTTP_STATUS_CREATED)
		.json(await User.create({ name, email, password }));
};

export const login: RequestHandler = async (req, res) => {
	const { email, password } = req.body as Partial<authRequest>;

	if (!email || !password) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "email and password are required" });
		return;
	}

	const user = await User.findByEmail(email);

	if (!user || user.password !== password) {
		res
			.status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
			.json({ error: "email is not registered" });
		return;
	}

	res.json(user);
};
