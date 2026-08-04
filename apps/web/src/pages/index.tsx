import { EllipsisVertical, Pin, Trash2 } from "lucide-react";
import React from "react";

import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuShortcut,
	MenuTrigger,
} from "#/components/ui/menu";
import type { Note } from "#/lib/notes";
import { NOTES } from "#/lib/notes";
import { useTitle } from "#/pages/+Layout";

function pinNote(id: string): void {
	console.log(`pin${id}`);
}

function deleteNote(id: string): void {
	console.log(`delete${id}`);
}

function openNote(id: string): void {
	console.log(`open${id}`);
}

// The trigger sits inside the card and its popup is portaled, so both reach the
// card's own handlers.
function isFromMenu(event: React.SyntheticEvent): boolean {
	return Boolean(
		(event.target as Element).closest(
			"[data-slot=menu-trigger],[data-slot=menu-popup]",
		),
	);
}

function NoteCard({ note }: { note: Note }): React.ReactNode {
	const [menuOpen, setMenuOpen] = React.useState(false);
	const triggerRef = React.useRef<HTMLButtonElement>(null);
	const handled = React.useRef<Event>(undefined);

	const isDuplicate = (event: React.SyntheticEvent): boolean => {
		if (handled.current === event.nativeEvent) {
			return true;
		}

		handled.current = event.nativeEvent;
		return false;
	};

	// Routed through the trigger so the menu keeps base-ui's own focus handling.
	const openMenu = (): void => {
		triggerRef.current?.focus();
		triggerRef.current?.click();
	};

	const handleKeyDown = (event: React.KeyboardEvent): void => {
		if (isDuplicate(event)) {
			return;
		}

		if ((event.key === "Enter" || event.key === " ") && !menuOpen) {
			openNote(note.id);
		} else if (event.key === "p" && (event.metaKey || event.ctrlKey)) {
			pinNote(note.id);
			setMenuOpen(false);
		} else if (event.key === "Backspace" && (event.metaKey || event.ctrlKey)) {
			deleteNote(note.id);
			setMenuOpen(false);
		} else {
			return;
		}

		event.preventDefault();
	};

	return (
		<Card
			className="cursor-pointer transition-colors hover:border-ring/40"
			onClick={(event) => {
				if (isFromMenu(event) || isDuplicate(event)) {
					return;
				}

				openNote(note.id);
			}}
			onContextMenu={(event) => {
				if (isFromMenu(event) || isDuplicate(event)) {
					return;
				}

				event.preventDefault();
				openMenu();
			}}
			onKeyDown={handleKeyDown}
			tabIndex={0}
		>
			<CardHeader>
				<CardTitle className="flex justify-between">
					<span>{note.title}</span>
					<Menu
						onOpenChange={setMenuOpen}
						open={menuOpen}
					>
						<MenuTrigger
							aria-label="Note options"
							ref={triggerRef}
							tabIndex={-1}
						>
							<EllipsisVertical className="size-3.5 text-muted-foreground" />
						</MenuTrigger>
						<MenuPopup sideOffset={4}>
							<MenuItem onClick={() => pinNote(note.id)}>
								<Pin aria-hidden="true" />
								Pin
								<MenuShortcut>⌘P</MenuShortcut>
							</MenuItem>
							<MenuSeparator />
							<MenuItem
								onClick={() => deleteNote(note.id)}
								variant="destructive"
							>
								<Trash2 aria-hidden="true" />
								Delete
								<MenuShortcut>⌘⌫</MenuShortcut>
							</MenuItem>
						</MenuPopup>
					</Menu>
				</CardTitle>
				<CardDescription className="line-clamp-2">
					{note.excerpt}
				</CardDescription>
			</CardHeader>
			<CardFooter className="gap-2">
				{note.pinned && <Pin className="size-3.5 text-muted-foreground" />}
				<span className="ms-auto text-muted-foreground text-xs">
					{note.updated}
				</span>
			</CardFooter>
		</Card>
	);
}

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
					<NoteCard
						key={note.id}
						note={note}
					/>
				))}
			</div>
		</>
	);
}
