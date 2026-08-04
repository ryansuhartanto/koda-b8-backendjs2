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
	Pin,
	RemoveFormatting,
	Strikethrough,
	TextQuote,
	Trash2,
} from "lucide-react";
import React from "react";

import {
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogClose,
	AlertDialog,
	AlertDialogHeader,
	AlertDialogPopup,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardAction,
	CardFrame,
	CardFrameFooter,
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
	DialogTrigger,
} from "#/components/ui/dialog";
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
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
import type { Note } from "#/lib/notes";
import { NOTES } from "#/lib/notes";
import { useTitle } from "#/pages/+Layout";

function pinNote(id: string): void {
	console.log(`pin${id}`);
}

function deleteNote(id: string): void {
	console.log(`delete${id}`);
}

function NoteDialog({ note }: { note: Note }): React.ReactNode {
	const editor = useEditor({
		extensions: [StarterKit, Markdown],
		editorProps: {
			attributes: {
				class: "size-full min-h-48 prose focus:outline-none",
			},
		},
		content: note.excerpt,
		autofocus: true,
	});

	return (
		<>
			<DialogHeader>
				<DialogTitle
					render={
						<input
							defaultValue={note.title}
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
				className="flex-row justify-start sm:justify-start"
			>
				<EditorToolbar editor={editor} />
			</DialogFooter>
		</>
	);
}

function EditorToolbar({ editor }: { editor: Editor }): React.ReactNode {
	const editorState = useEditorState({
		editor,
		selector: (ctx) => ({
			// Text formatting
			isBold: ctx.editor.isActive("bold") ?? false,
			canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
			isItalic: ctx.editor.isActive("italic") ?? false,
			canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
			isStrike: ctx.editor.isActive("strike") ?? false,
			canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
			isCode: ctx.editor.isActive("code") ?? false,
			canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
			canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,

			// Block types
			isParagraph: ctx.editor.isActive("paragraph") ?? false,
			isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
			isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
			isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
			isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
			isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
			isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,

			// Lists and blocks
			isBulletList: ctx.editor.isActive("bulletList") ?? false,
			isOrderedList: ctx.editor.isActive("orderedList") ?? false,
			isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
			isBlockquote: ctx.editor.isActive("blockquote") ?? false,

			// History
			canUndo: ctx.editor.can().chain().undo().run() ?? false,
			canRedo: ctx.editor.can().chain().redo().run() ?? false,
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
	).filter((format): format is Format => format !== false);

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

function NoteCard({ note }: { note: Note }): React.ReactNode {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [confirmOpen, setConfirmOpen] = React.useState(false);
	const [menuOpen, setMenuOpen] = React.useState(false);

	const handled = React.useRef<Event>(undefined);

	const isDuplicate = (event: React.SyntheticEvent): boolean => {
		if (handled.current === event.nativeEvent) {
			return true;
		}

		handled.current = event.nativeEvent;
		return false;
	};

	const handleKeyDown = (event: React.KeyboardEvent): void => {
		if (isDuplicate(event)) {
			return;
		}

		if ((event.key === "Enter" || event.key === " ") && menuOpen) {
			return;
		}

		if (event.key === "p" && (event.metaKey || event.ctrlKey)) {
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
		<Dialog
			onOpenChange={setDialogOpen}
			open={dialogOpen}
		>
			<DialogTrigger
				render={
					<CardFrame
						className="cursor-pointer"
						onContextMenu={(event) => {
							event.preventDefault();
							setMenuOpen(true);
						}}
						onKeyDown={handleKeyDown}
					/>
				}
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
						</CardAction>
					</CardHeader>
					<CardPanel>{note.excerpt}</CardPanel>
				</Card>
				<CardFrameFooter className="flex flex-row-reverse justify-between text-xs text-muted-foreground">
					<span>{note.updated}</span>
					{note.pinned && (
						<Pin
							aria-label="Pinned"
							className="size-[1em]"
						/>
					)}
				</CardFrameFooter>
			</DialogTrigger>
			<DialogPopup bottomStickOnMobile={false}>
				<NoteDialog note={note} />
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
