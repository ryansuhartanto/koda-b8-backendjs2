import { Markdown } from "@tiptap/markdown";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import {
	Bold,
	Code,
	Code2,
	EllipsisVertical,
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	Heading6,
	Italic,
	List,
	ListOrdered,
	Pilcrow,
	RemoveFormatting,
	Strikethrough,
	TextQuote,
	Trash2,
} from "lucide-react";
import React from "react";

import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogPopup,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardAction,
	CardFrame,
	CardHeader,
	CardPanel,
	CardTitle,
} from "#/components/ui/card";
import {
	Dialog,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
} from "#/components/ui/dialog";
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuShortcut,
	MenuTrigger,
} from "#/components/ui/menu";
import {
	Select,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Toggle } from "#/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import {
	Toolbar,
	ToolbarGroup,
	ToolbarSeparator,
} from "#/components/ui/toolbar";
import { useNotes } from "#/contexts/notes";
import type { Note } from "#/lib/notes";
import { useTitle } from "#/pages/+Layout";

function NoteDialog({
	note,
	getDirty,
	onSave,
}: {
	note?: Note;
	getDirty: React.RefObject<() => boolean>;
	onSave: (title: string, body: string) => Promise<void>;
}): React.ReactNode {
	const titleRef = React.useRef<HTMLInputElement>(null);
	const [saving, setSaving] = React.useState(false);

	const editor = useEditor({
		extensions: [StarterKit, Markdown],
		editorProps: {
			attributes: {
				class: "size-full min-h-48 prose focus:outline-none",
			},
		},
		content: note?.body ?? "",
		contentType: "markdown",
		autofocus: true,
	});

	React.useEffect(() => {
		if (!editor) {
			return;
		}
		getDirty.current = () =>
			titleRef.current?.value.trim() !== (note?.title ?? "").trim() ||
			editor.getMarkdown() !== (note?.body ?? "");
	}, [editor, getDirty, note]);

	const handleSave = async (): Promise<void> => {
		if (!editor || !titleRef.current?.value.trim()) {
			return;
		}
		setSaving(true);
		await onSave(titleRef.current.value.trim(), editor.getMarkdown());
		setSaving(false);
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle
					render={
						<input
							ref={titleRef}
							defaultValue={note?.title ?? ""}
							placeholder="Title"
							type="text"
							className="focus:outline-none"
						/>
					}
				/>
			</DialogHeader>
			<DialogPanel>
				<EditorContent editor={editor} />
			</DialogPanel>
			<DialogFooter
				variant="bare"
				className="flex-row items-center justify-between sm:justify-between gap-2"
			>
				{editor && <EditorToolbar editor={editor} />}
				<Button
					size="sm"
					loading={saving}
					onClick={() => {
						void handleSave();
					}}
				>
					Save
				</Button>
			</DialogFooter>
		</>
	);
}

function EditorToolbar({ editor }: { editor: Editor }): React.ReactNode {
	const editorState = useEditorState({
		editor,
		selector: (ctx) => ({
			isBold: ctx.editor.isActive("bold") ?? false,
			canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
			isItalic: ctx.editor.isActive("italic") ?? false,
			canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
			isStrike: ctx.editor.isActive("strike") ?? false,
			canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
			isCode: ctx.editor.isActive("code") ?? false,
			canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
			canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
			isParagraph: ctx.editor.isActive("paragraph") ?? false,
			isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
			isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
			isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
			isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
			isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
			isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
			isBulletList: ctx.editor.isActive("bulletList") ?? false,
			isOrderedList: ctx.editor.isActive("orderedList") ?? false,
			isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
			isBlockquote: ctx.editor.isActive("blockquote") ?? false,
		}),
	});

	const blockItems = [
		{ value: "paragraph", icon: Pilcrow },
		{ value: "h1", icon: Heading1 },
		{ value: "h2", icon: Heading2 },
		{ value: "h3", icon: Heading3 },
		{ value: "h4", icon: Heading4 },
		{ value: "h5", icon: Heading5 },
		{ value: "h6", icon: Heading6 },
	];

	const headingIndex = [
		editorState.isHeading1,
		editorState.isHeading2,
		editorState.isHeading3,
		editorState.isHeading4,
		editorState.isHeading5,
		editorState.isHeading6,
	].findIndex(Boolean);
	const blockType = headingIndex !== -1 ? `h${headingIndex + 1}` : "paragraph";

	type Format = "bold" | "italic" | "strike";
	const formats = (
		[
			editorState.isBold && "bold",
			editorState.isItalic && "italic",
			editorState.isStrike && "strike",
		] as const
	).filter((f): f is Format => f !== false);

	type List = "bulletList" | "orderedList";
	const list = (
		[
			editorState.isBulletList && "bulletList",
			editorState.isOrderedList && "orderedList",
		] as const
	).filter((l): l is List => l !== false);

	type Block = "codeBlock" | "blockquote";
	const block = (
		[
			editorState.isCodeBlock && "codeBlock",
			editorState.isBlockquote && "blockquote",
		] as const
	).filter((b): b is Block => b !== false);

	return (
		<Toolbar aria-label="Formatting">
			<ToolbarGroup>
				<Select
					itemToStringValue={(item) => item.value}
					value={blockItems.find((i) => i.value === blockType)}
					onValueChange={(item) => {
						if (!item || item.value === "paragraph") {
							editor.chain().focus().setParagraph().run();
						} else {
							editor
								.chain()
								.focus()
								.setHeading({
									level: Math.trunc(Number(item.value[1])) as
										| 1
										| 2
										| 3
										| 4
										| 5
										| 6,
								})
								.run();
						}
					}}
				>
					<SelectTrigger className="min-w-0">
						<SelectValue>
							{(item: (typeof blockItems)[number]) => <item.icon />}
						</SelectValue>
					</SelectTrigger>
					<SelectPopup>
						{blockItems.map((item) => (
							<SelectItem
								key={item.value}
								value={item}
							>
								<item.icon />
							</SelectItem>
						))}
					</SelectPopup>
				</Select>
			</ToolbarGroup>
			<ToolbarSeparator />
			<ToolbarGroup>
				<ToggleGroup
					loopFocus={false}
					multiple={true}
					value={formats}
					variant="outline"
				>
					<ToggleGroupItem
						aria-label="Bold"
						disabled={!editorState.canBold}
						value="bold"
						onPressedChange={() => {
							editor.chain().focus().toggleBold().run();
						}}
					>
						<Bold />
					</ToggleGroupItem>
					<ToggleGroupItem
						aria-label="Italic"
						disabled={!editorState.canItalic}
						value="italic"
						onPressedChange={() => {
							editor.chain().focus().toggleItalic().run();
						}}
					>
						<Italic />
					</ToggleGroupItem>
					<ToggleGroupItem
						aria-label="Strikethrough"
						disabled={!editorState.canStrike}
						value="strike"
						onPressedChange={() => {
							editor.chain().focus().toggleStrike().run();
						}}
					>
						<Strikethrough />
					</ToggleGroupItem>
				</ToggleGroup>
				<Toggle
					aria-label="Code"
					disabled={!editorState.canCode}
					pressed={editorState.isCode}
					variant="outline"
					onPressedChange={() => {
						editor.chain().focus().toggleCode().run();
					}}
				>
					<Code />
				</Toggle>
				<Toggle
					aria-label="Clear marks"
					disabled={!editorState.canClearMarks}
					onPressedChange={() => {
						editor.chain().focus().unsetAllMarks().run();
					}}
				>
					<RemoveFormatting />
				</Toggle>
			</ToolbarGroup>
			<ToolbarSeparator />
			<ToolbarGroup>
				<ToggleGroup
					loopFocus={false}
					variant="outline"
					value={list}
				>
					<ToggleGroupItem
						aria-label="Bullet list"
						value="bulletList"
						onPressedChange={() => {
							editor.chain().focus().toggleBulletList().run();
						}}
					>
						<List />
					</ToggleGroupItem>
					<ToggleGroupItem
						aria-label="Ordered list"
						value="orderedList"
						onPressedChange={() => {
							editor.chain().focus().toggleOrderedList().run();
						}}
					>
						<ListOrdered />
					</ToggleGroupItem>
				</ToggleGroup>
				<ToggleGroup
					loopFocus={false}
					variant="outline"
					value={block}
				>
					<ToggleGroupItem
						aria-label="Code block"
						value="codeBlock"
						onPressedChange={() => {
							editor.chain().focus().toggleCodeBlock().run();
						}}
					>
						<Code2 />
					</ToggleGroupItem>
					<ToggleGroupItem
						aria-label="Blockquote"
						value="blockquote"
						onPressedChange={() => {
							editor.chain().focus().toggleBlockquote().run();
						}}
					>
						<TextQuote />
					</ToggleGroupItem>
				</ToggleGroup>
			</ToolbarGroup>
		</Toolbar>
	);
}

function NoteCard({
	note,
	onDelete,
	onSave,
}: {
	note: Note;
	onDelete: () => void;
	onSave: (title: string, body: string) => Promise<void>;
}): React.ReactNode {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [confirmOpen, setConfirmOpen] = React.useState(false);
	const [menuOpen, setMenuOpen] = React.useState(false);
	const getDirty = React.useRef<() => boolean>(() => false);

	const handleSave = async (title: string, body: string): Promise<void> => {
		await onSave(title, body);
		setDialogOpen(false);
	};

	const handleKeyDown = (event: React.KeyboardEvent): void => {
		if ((event.key === "Enter" || event.key === " ") && !menuOpen) {
			setDialogOpen(true);
		} else if (event.key === "Backspace" && (event.metaKey || event.ctrlKey)) {
			onDelete();
			setMenuOpen(false);
		} else {
			return;
		}
		event.preventDefault();
	};

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open && getDirty.current()) {
					setConfirmOpen(true);
				} else {
					setDialogOpen(open);
				}
			}}
			open={dialogOpen}
		>
			<CardFrame
				className="cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus:outline-none"
				tabIndex={0}
				onClick={() => setDialogOpen(true)}
				onContextMenu={(event) => {
					event.preventDefault();
					setMenuOpen(true);
				}}
				onKeyDown={handleKeyDown}
			>
				<Card className="grow">
					<CardHeader>
						<CardTitle>{note.title}</CardTitle>
						<CardAction>
							<Menu
								open={menuOpen}
								onOpenChange={setMenuOpen}
							>
								<MenuTrigger
									aria-label="Note options"
									tabIndex={-1}
									onClick={(e) => e.stopPropagation()}
									render={
										<Button
											variant="ghost"
											size="icon-xs"
										/>
									}
								>
									<EllipsisVertical />
								</MenuTrigger>
								<MenuPopup sideOffset={4}>
									<MenuItem
										variant="destructive"
										onClick={onDelete}
									>
										<Trash2 aria-hidden="true" />
										Delete
										<MenuShortcut>⌘⌫</MenuShortcut>
									</MenuItem>
								</MenuPopup>
							</Menu>
						</CardAction>
					</CardHeader>
					<CardPanel>{note.body}</CardPanel>
				</Card>
			</CardFrame>
			<DialogPopup bottomStickOnMobile={false}>
				<NoteDialog
					note={note}
					getDirty={getDirty}
					onSave={handleSave}
				/>
			</DialogPopup>
			<AlertDialog
				onOpenChange={setConfirmOpen}
				open={confirmOpen}
			>
				<AlertDialogPopup>
					<AlertDialogHeader>
						<AlertDialogTitle>Discard changes?</AlertDialogTitle>
						<AlertDialogDescription>
							Your message will be lost.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogClose render={<Button variant="ghost" />}>
							Go back
						</AlertDialogClose>
						<Button
							onClick={() => {
								setConfirmOpen(false);
								setDialogOpen(false);
							}}
						>
							Discard
						</Button>
					</AlertDialogFooter>
				</AlertDialogPopup>
			</AlertDialog>
		</Dialog>
	);
}

export default function Page(): React.ReactNode {
	const title = useTitle();
	const {
		notes,
		createOpen,
		closeCreateNote,
		createNote,
		editNote,
		removeNote,
	} = useNotes();
	const createDirty = React.useRef<() => boolean>(() => false);

	const handleCreate = async (title: string, body: string): Promise<void> => {
		await createNote(title, body);
		closeCreateNote();
	};

	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="font-heading font-semibold text-xl">{title}</h1>
				<span className="text-muted-foreground text-sm">
					{notes.length} notes
				</span>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{notes.map((note) => (
					<NoteCard
						key={note.id}
						note={note}
						onDelete={() => removeNote(note.id)}
						onSave={async (t, b) => {
							await editNote(note.id, t, b);
						}}
					/>
				))}
			</div>

			<Dialog
				open={createOpen}
				onOpenChange={(open) => {
					if (!open) {
						closeCreateNote();
					}
				}}
			>
				<DialogPopup bottomStickOnMobile={false}>
					<NoteDialog
						getDirty={createDirty}
						onSave={handleCreate}
					/>
				</DialogPopup>
			</Dialog>
		</>
	);
}
