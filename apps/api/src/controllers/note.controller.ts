import http2 from "node:http2";

import type { RequestHandler } from "express";

import type { AuthLocals } from "#/middlewares/auth";
import * as Note from "#/models/note.model";

type idParams = {
	id: string;
};

async function findOwned(
	id: number,
	idUser: number,
): Promise<Note.Note | undefined> {
	const note = await Note.findById(id);
	return note?.["id-user"] === idUser ? note : undefined;
}

export const getAll: RequestHandler = async (_req, res) => {
	const { idUser } = res.locals as AuthLocals;

	res.json(await Note.findAll(idUser));
};

export const getId: RequestHandler<idParams> = async (req, res) => {
	const { idUser } = res.locals as AuthLocals;
	const note = await findOwned(Number(req.params.id), idUser);

	if (!note) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "note not found" });
		return;
	}

	res.json(note);
};

export const post: RequestHandler = async (req, res) => {
	const { idUser } = res.locals as AuthLocals;
	const { title, body } = req.body as Partial<Note.Note>;

	if (!title) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "title is required", field: "title" });
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
	const { idUser } = res.locals as AuthLocals;
	const id = Number(req.params.id);
	if (!(await findOwned(id, idUser))) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "note not found" });
		return;
	}

	const { title, body } = req.body as Partial<Note.Note>;

	res.json(await Note.edit(id, { title, body }));
};

export const del: RequestHandler<idParams> = async (req, res) => {
	const { idUser } = res.locals as AuthLocals;
	const id = Number(req.params.id);

	if (!(await findOwned(id, idUser))) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "note not found" });
		return;
	}

	await Note.remove(id);

	res.json();
};
