import { pool } from "#/lib/db";

export type User = {
	id: number;
	name: string;
	email: string;
	password_hash: string;
};

const columns = "id, name, email, password_hash";

export async function findAll(): Promise<User[]> {
	const { rows } = await pool.query<User>(
		`SELECT ${columns} FROM users ORDER BY id`,
	);
	return rows;
}

export async function findById(id: number): Promise<User | undefined> {
	const { rows } = await pool.query<User>(
		`SELECT ${columns} FROM users WHERE id = $1`,
		[id],
	);
	return rows[0];
}

export async function findByEmail(email: string): Promise<User | undefined> {
	const { rows } = await pool.query<User>(
		`SELECT ${columns} FROM users WHERE email = $1`,
		[email],
	);
	return rows[0];
}

export async function create(user: Omit<User, "id">): Promise<User> {
	const { rows } = await pool.query<User>(
		`INSERT INTO users (name, email, password_hash)
		VALUES ($1, $2, $3)
		RETURNING ${columns}`,
		[user.name, user.email, user.password_hash],
	);
	return rows[0]!;
}

export async function edit(id: number, mod: Partial<User>): Promise<User> {
	const { rows } = await pool.query<User>(
		`UPDATE users
		SET name = COALESCE($2, name), email = COALESCE($3, email)
		WHERE id = $1
		RETURNING ${columns}`,
		[id, mod.name, mod.email],
	);
	return rows[0]!;
}

export async function remove(id: number): Promise<void> {
	// notes are removed by the foreign key
	await pool.query("DELETE FROM users WHERE id = $1", [id]);
}
