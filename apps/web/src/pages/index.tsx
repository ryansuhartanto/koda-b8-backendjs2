import { Pin } from "lucide-react";

import { Badge } from "#/components/ui/badge";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { useTitle } from "#/pages/+Layout";

type Note = {
	id: string;
	title: string;
	excerpt: string;
	updated: string;
	pinned?: boolean;
};

const NOTES: Note[] = [
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

export default function Page(): React.ReactNode {
	const title = useTitle();

	return (
		<>
			<div className="flex items-baseline justify-between">
				<h1 className="font-heading font-semibold text-xl">{title}</h1>
				<span className="text-muted-foreground text-sm">
					{NOTES.length} notes
				</span>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{NOTES.map((note) => (
					<Card
						className="transition-colors hover:border-ring/40"
						key={note.id}
					>
						<CardHeader className="grow">
							<CardTitle>
								<span>{note.title}</span>
							</CardTitle>
							<CardDescription className="line-clamp-2">
								{note.excerpt}
							</CardDescription>
						</CardHeader>
						<CardFooter className="gap-2">
							{note.pinned && (
								<Pin className="size-3.5 text-muted-foreground" />
							)}
							<span className="ms-auto text-muted-foreground text-xs">
								{note.updated}
							</span>
						</CardFooter>
					</Card>
				))}
			</div>
		</>
	);
}
