import type { FileText } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

import { NAV_ITEMS } from "#/components/app-sidebar";
import {
	Command,
	CommandCollection,
	CommandDescription,
	CommandDialog,
	CommandDialogPopup,
	CommandEmpty,
	CommandGroup,
	CommandGroupLabel,
	CommandInput,
	CommandItem,
	CommandList,
	CommandPanel,
} from "#/components/ui/command";
import { useNotes } from "#/contexts/notes";

type CommandEntry = {
	id?: number;
	icon?: typeof FileText;
	url: string;
	label: string;
	value: string;
	body?: string;
};

type CommandEntryGroup = {
	items: CommandEntry[];
	value: string;
};

const PAGES_GROUP: CommandEntryGroup = {
	items: NAV_ITEMS.map((item) => ({
		icon: item.icon,
		url: item.url,
		label: item.title,
		value: item.title,
	})),
	value: "Pages",
};

const COMMAND_PALETTE_SHORTCUT = "k";

export function CommandPalette({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}): React.ReactNode {
	const navigate = useNavigate();
	const { notes } = useNotes();

	const groups: CommandEntryGroup[] = [
		PAGES_GROUP,
		{
			items: notes.map((note) => ({
				id: note.id,
				url: "/",
				label: note.title,
				value: `${note.title} ${note.body}`,
				body: note.body,
			})),
			value: "Notes",
		},
	];

	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent): void => {
			if (
				event.key === COMMAND_PALETTE_SHORTCUT &&
				(event.metaKey || event.ctrlKey)
			) {
				event.preventDefault();
				onOpenChange(!open);
			}
		};

		globalThis.addEventListener("keydown", handleKeyDown);
		return () => globalThis.removeEventListener("keydown", handleKeyDown);
	}, [onOpenChange, open]);

	return (
		<CommandDialog
			onOpenChange={onOpenChange}
			open={open}
		>
			<CommandDialogPopup aria-label="Command palette">
				<Command
					items={groups}
					itemToStringValue={(item) => (item as CommandEntry).value}
				>
					<CommandInput
						aria-label="Search notes and pages"
						placeholder="Search notes and pages"
					/>
					<CommandPanel>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandList>
							{(group: CommandEntryGroup) => (
								<CommandGroup
									items={group.items}
									key={group.value}
								>
									<CommandGroupLabel>{group.value}</CommandGroupLabel>
									<CommandCollection>
										{(item: CommandEntry) => (
											<CommandItem
												key={item.id ?? item.value}
												onClick={() => {
													onOpenChange(false);
													void navigate(item.url);
												}}
												value={item}
											>
												{item.icon && (
													<item.icon className="size-4 shrink-0 text-muted-foreground" />
												)}
												<span className="truncate">{item.label}</span>
												{item.body && (
													<CommandDescription>{item.body}</CommandDescription>
												)}
											</CommandItem>
										)}
									</CommandCollection>
								</CommandGroup>
							)}
						</CommandList>
					</CommandPanel>
				</Command>
			</CommandDialogPopup>
		</CommandDialog>
	);
}
