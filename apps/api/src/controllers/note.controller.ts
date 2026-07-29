import http2 from "node:http2";

import type { RequestHandler } from "express";

import * as Note from "#/models/note.model";
import * as User from "#/models/user.model";

type idParams = {
	id: string;
};

type getAllQuery = {
	"id-user"?: string;
};

export const getAll: RequestHandler<
	unknown,
	unknown,
	unknown,
	getAllQuery
> = async (req, res) => {
	const idUser = req.query["id-user"]
		? Number(req.query["id-user"])
		: undefined;

	res.json(await Note.findAll(idUser));
};

export const getId: RequestHandler<idParams> = async (req, res) => {
	const id = Number(req.params.id);
	const note = await Note.findById(id);

	if (!note) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "note not found" });
		return;
	}

	res.json(note);
};

export const post: RequestHandler = async (req, res) => {
	const { "id-user": idUser, title, body } = req.body as Partial<Note.Note>;

	if (!idUser || !title) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "id-user and title are required" });
		return;
	}

	if (!(await User.findById(idUser))) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "user not found" });
		return;
	}

	res.status(http2.constants.HTTP_STATUS_CREATED).json(
		await Note.create({
			"id-user": idUser,
			title,
			"body": body ?? "",
		}),
	);
};

export const patch: RequestHandler<idParams> = async (req, res) => {
	const id = Number(req.params.id);
	const note = await Note.findById(id);

	if (!note) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "note not found" });
		return;
	}

	const mod = req.body as Partial<Note.Note>;

	res.json(await Note.edit(id, mod));
};

export const del: RequestHandler<idParams> = async (req, res) => {
	const id = Number(req.params.id);
	const note = await Note.findById(id);

	if (!note) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "note not found" });
		return;
	}

	await Note.remove(id);

	res.json();
};
