import { pool } from "#/lib/db";

export type Note = {
	"id": number;
	"id-user": number;
	"title": string;
	"body": string;
};

const columns = `id, id_user AS "id-user", title, body`;

export async function findAll(idUser: number): Promise<Note[]> {
	const { rows } = await pool.query<Note>(
		`SELECT ${columns} FROM notes WHERE id_user = $1 ORDER BY id`,
		[idUser],
	);
	return rows;
}

export async function findById(id: number): Promise<Note | undefined> {
	const { rows } = await pool.query<Note>(
		`SELECT ${columns} FROM notes WHERE id = $1`,
		[id],
	);
	return rows[0];
}

export async function create(note: Omit<Note, "id">): Promise<Note> {
	const { rows } = await pool.query<Note>(
		`INSERT INTO notes (id_user, title, body)
		VALUES ($1, $2, $3)
		RETURNING ${columns}`,
		[note["id-user"], note.title, note.body],
	);
	return rows[0]!;
}

export async function edit(id: number, mod: Partial<Note>): Promise<Note> {
	const { rows } = await pool.query<Note>(
		`UPDATE notes
		SET title = COALESCE($2, title), body = COALESCE($3, body)
		WHERE id = $1
		RETURNING ${columns}`,
		[id, mod.title, mod.body],
	);
	return rows[0]!;
}

export async function remove(id: number): Promise<void> {
	await pool.query("DELETE FROM notes WHERE id = $1", [id]);
}
