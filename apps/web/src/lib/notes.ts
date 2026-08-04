export type Note = {
	id: string;
	title: string;
	excerpt: string;
	updated: string;
	pinned?: boolean;
};

export const NOTES: Note[] = [
	{
		excerpt:
			"Ship the sidebar shell first, then wire the note list to real data.",
		id: "1",
		pinned: true,
		title: "Weekly plan",
		updated: "2 hours ago",
	},
	{
		excerpt: "Cold brew ratio 1:8, steep 16 hours, dilute to taste.",
		id: "2",
		title: "Coffee notes",
		updated: "Yesterday",
	},
	{
		excerpt:
			"A note app where every note is a block, and blocks can be embedded anywhere.",
		id: "3",
		title: "Ideas worth keeping",
		updated: "3 days ago",
	},
];
