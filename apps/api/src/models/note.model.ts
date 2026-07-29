import fs from "node:fs/promises";

export type Note = {
	"id": number;
	"id-user": number;
	"title": string;
	"body": string;
};

const file = "tmp/notes.json";

async function read(): Promise<Note[]> {
	const content = await fs.readFile(file, { encoding: "utf8" });
	return JSON.parse(content) as Note[];
}

async function write(data: Note[]) {
	const content = JSON.stringify(data, undefined, "\t");
	await fs.writeFile(file, content, { encoding: "utf8" });
}

export async function findAll(idUser?: number): Promise<Note[]> {
	const data = await read();
	return idUser === undefined
		? data
		: data.filter((note) => note["id-user"] === idUser);
}

export async function findById(id: number): Promise<Note | undefined> {
	const data = await read();
	return data.find((note) => note.id === id);
}

export async function create(note: Omit<Note, "id">): Promise<Note> {
	const data = await read();
	const created = {
		id: Math.max(0, ...data.map((existing) => existing.id)) + 1,
		...note,
	};

	data.push(created);
	await write(data);
	return created;
}

export async function edit(id: number, mod: Partial<Note>): Promise<Note> {
	const data = await read();
	const index = data.findIndex((note) => note.id === id);
	const edited = { ...data[index]!, ...mod, id };

	data[index] = edited;
	await write(data);
	return edited;
}

export async function remove(id: number): Promise<void> {
	const data = await read();

	await write(data.filter((note) => note.id !== id));
}

export async function removeByUser(idUser: number): Promise<void> {
	const data = await read();

	await write(data.filter((note) => note["id-user"] !== idUser));
}
