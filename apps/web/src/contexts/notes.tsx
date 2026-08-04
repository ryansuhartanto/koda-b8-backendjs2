import React from "react";

import { useAuth } from "#/contexts/auth";
import { apiCall } from "#/lib/api";
import type { Note } from "#/lib/notes";

type NotesContext = {
	notes: Note[];
	createOpen: boolean;
	openCreateNote: () => void;
	closeCreateNote: () => void;
	fetchNotes: () => Promise<void>;
	createNote: (title: string, body: string) => Promise<Note>;
	editNote: (id: number, title: string, body: string) => Promise<Note>;
	removeNote: (id: number) => void;
};

const Ctx = React.createContext<NotesContext | undefined>(undefined);

export function NotesProvider({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement {
	const { user } = useAuth();
	const [notes, setNotes] = React.useState<Note[]>([]);
	const [createOpen, setCreateOpen] = React.useState(false);

	const fetchNotes = async (): Promise<void> => {
		const data = await apiCall<Note[]>("hello", `/notes?id-user=${user!.id}`);
		setNotes(data);
	};

	React.useEffect(() => {
		void fetchNotes();
	}, [user?.id]);

	const createNote = async (title: string, body: string): Promise<Note> => {
		const note = await apiCall<Note>("hello", "/notes", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ "id-user": user!.id, title, body }),
		});
		setNotes((prev) => [...prev, note]);
		return note;
	};

	const editNote = async (
		id: number,
		title: string,
		body: string,
	): Promise<Note> => {
		const note = await apiCall<Note>("hello", `/notes/${id}`, {
			method: "PATCH",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ title, body }),
		});
		setNotes((prev) => prev.map((n) => (n.id === id ? note : n)));
		return note;
	};

	const removeNote = (id: number): void => {
		void apiCall("hello", `/notes/${id}`, { method: "DELETE" });
		setNotes((prev) => prev.filter((n) => n.id !== id));
	};

	return (
		<Ctx.Provider
			value={{
				notes,
				createOpen,
				openCreateNote: () => setCreateOpen(true),
				closeCreateNote: () => setCreateOpen(false),
				fetchNotes,
				createNote,
				editNote,
				removeNote,
			}}
		>
			{children}
		</Ctx.Provider>
	);
}

export function useNotes(): NotesContext {
	const ctx = React.useContext(Ctx);
	if (!ctx) {
		throw new Error("useNotes must be used inside NotesProvider");
	}
	return ctx;
}
