import http2 from "node:http2";

import { compare, hash } from "bcryptjs";
import type { RequestHandler } from "express";

import * as Token from "#/lib/token";
import * as User from "#/models/user.model";

type authRequest = {
	name: string;
	email: string;
	password: string;
};

type sessionResponse = {
	token: string;
	user: Omit<User.User, "password">;
};

const cost = 10;

// distinguishing a missing account from a wrong password is a user-enumeration oracle
const invalidCredentials = "invalid email or password";

function session(user: User.User): sessionResponse {
	return {
		token: Token.sign(user.id),
		user: { id: user.id, name: user.name, email: user.email },
	};
}

export const register: RequestHandler = async (req, res) => {
	const { name, email, password } = req.body as Partial<authRequest>;

	if (!name) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "name is required", field: "name" });
		return;
	}

	if (!email) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "email is required", field: "email" });
		return;
	}

	if (!password) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "password is required", field: "password" });
		return;
	}

	if (await User.findByEmail(email)) {
		res
			.status(http2.constants.HTTP_STATUS_CONFLICT)
			.json({ error: "email already registered", field: "email" });
		return;
	}

	const user = await User.create({
		name,
		email,
		password_hash: await hash(password, cost),
	});

	res.status(http2.constants.HTTP_STATUS_CREATED).json(session(user));
};

export const login: RequestHandler = async (req, res) => {
	const { email, password } = req.body as Partial<authRequest>;

	if (!email) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "email is required", field: "email" });
		return;
	}

	if (!password) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "password is required", field: "password" });
		return;
	}

	const user = await User.findByEmail(email);

	if (!user || !(await compare(password, user.password_hash))) {
		res
			.status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
			.json({ error: invalidCredentials });
		return;
	}

	res.json(session(user));
};
