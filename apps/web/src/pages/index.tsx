import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { EllipsisVertical, Pin, Trash2, X } from "lucide-react";
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

// The trigger sits inside the card and its popup is portaled, so both reach the
// card's own handlers.
function isFromMenu(event: React.SyntheticEvent): boolean {
	return Boolean(
		(event.target as Element).closest(
			"[data-slot=menu-trigger],[data-slot=menu-popup]",
		),
	);
}

function NoteOverlay({
	note,
	onClose,
}: {
	note: Note;
	onClose: () => void;
}): React.ReactNode {
	const [visible, setVisible] = React.useState(false);

	React.useEffect(() => {
		requestAnimationFrame(() => setVisible(true));
	}, []);

	const editor = useEditor({
		extensions: [StarterKit],
		content: `<p>${note.excerpt}</p>`,
	});

	const handleClose = (): void => {
		setVisible(false);
		setTimeout(onClose, 200);
	};

	React.useEffect(() => {
		const onKey = (e: KeyboardEvent): void => {
			if (e.key === "Escape") {
				handleClose();
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, []);

	return (
		<div
			aria-modal="true"
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-[background-color] duration-200 ${visible ? "bg-black/60" : "bg-black/0"}`}
			role="dialog"
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					handleClose();
				}
			}}
		>
			<div
				className={`w-full max-w-2xl transition-[opacity,transform] duration-200 ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
			>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span>{note.title}</span>
							<button
								aria-label="Close"
								className="text-muted-foreground transition-colors hover:text-foreground"
								type="button"
								onClick={handleClose}
							>
								<X className="size-4" />
							</button>
						</CardTitle>
					</CardHeader>
					<div className="px-6 pb-6">
						<EditorContent
							className="prose prose-sm dark:prose-invert max-w-none min-h-48 focus-within:[&_.tiptap]:outline-none"
							editor={editor}
						/>
					</div>
				</Card>
			</div>
		</div>
	);
}

function NoteCard({
	note,
	onOpen,
}: {
	note: Note;
	onOpen: (note: Note) => void;
}): React.ReactNode {
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
			onOpen(note);
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
			tabIndex={0}
			onClick={(event) => {
				if (isFromMenu(event) || isDuplicate(event)) {
					return;
				}

				onOpen(note);
			}}
			onContextMenu={(event) => {
				if (isFromMenu(event) || isDuplicate(event)) {
					return;
				}

				event.preventDefault();
				openMenu();
			}}
			onKeyDown={handleKeyDown}
		>
			<CardHeader>
				<CardTitle className="flex justify-between">
					<span>{note.title}</span>
					<Menu
						open={menuOpen}
						onOpenChange={setMenuOpen}
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
								variant="destructive"
								onClick={() => deleteNote(note.id)}
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
	const [activeNote, setActiveNote] = React.useState<Note>();

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
						onOpen={setActiveNote}
					/>
				))}
			</div>

			{activeNote && (
				<NoteOverlay
					note={activeNote}
					onClose={() => setActiveNote(undefined)}
				/>
			)}
		</>
	);
}
