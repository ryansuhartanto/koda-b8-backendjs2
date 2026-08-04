import http2 from "node:http2";

import type { RequestHandler } from "express";

import * as Note from "#/models/note.model";
import * as User from "#/models/user.model";

type idParams = {
	id: string;
};

export const getAll: RequestHandler = async (_req, res) => {
	res.json(await User.findAll());
};

export const getId: RequestHandler<idParams> = async (req, res) => {
	const id = Number(req.params.id);
	const user = await User.findById(id);

	if (!user) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "user not found" });
		return;
	}

	res.json(user);
};

export const patch: RequestHandler<idParams> = async (req, res) => {
	const id = Number(req.params.id);
	const user = await User.findById(id);

	if (!user) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "user not found" });
		return;
	}

	const mod = req.body as Partial<User.User>;
	const owner = mod.email ? await User.findByEmail(mod.email) : undefined;

	if (owner && owner.id !== id) {
		res
			.status(http2.constants.HTTP_STATUS_CONFLICT)
			.json({ error: "email already registered", field: "email" });
		return;
	}

	res.json(await User.edit(id, mod));
};

export const del: RequestHandler<idParams> = async (req, res) => {
	const id = Number(req.params.id);
	const user = await User.findById(id);

	if (!user) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "user not found" });
		return;
	}

	await Note.removeByUser(id);
	await User.remove(id);

	res.json();
};
