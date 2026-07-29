import fs from "node:fs/promises";

export type User = {
	id: number;
	name: string;
	email: string;
	password: string;
};

const file = "tmp/users.json";

async function read(): Promise<User[]> {
	const content = await fs.readFile(file, { encoding: "utf8" });
	return JSON.parse(content) as User[];
}

async function write(data: User[]) {
	const content = JSON.stringify(data, undefined, "\t");
	await fs.writeFile(file, content, { encoding: "utf8" });
}

export async function findAll(): Promise<User[]> {
	return read();
}

export async function findById(id: number): Promise<User | undefined> {
	const data = await read();
	return data.find((user) => user.id === id);
}

export async function findByEmail(email: string): Promise<User | undefined> {
	const data = await read();
	return data.find((user) => user.email === email);
}

export async function create(user: Omit<User, "id">): Promise<User> {
	const data = await read();
	const created = {
		id: Math.max(0, ...data.map((existing) => existing.id)) + 1,
		...user,
	};

	data.push(created);
	await write(data);
	return created;
}

export async function edit(id: number, mod: Partial<User>): Promise<User> {
	const data = await read();
	const index = data.findIndex((user) => user.id === id);
	const edited = { ...data[index]!, ...mod, id };

	data[index] = edited;
	await write(data);
	return edited;
}

export async function remove(id: number): Promise<void> {
	const data = await read();

	await write(data.filter((user) => user.id !== id));
}
