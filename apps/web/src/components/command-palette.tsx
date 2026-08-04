import type { FileText } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

import { NAV_ITEMS } from "#/components/app-sidebar";
import {
	Command,
	CommandCollection,
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
import { NOTES } from "#/lib/notes";

// Autocomplete filters object items on their `value` property, so `value` holds
// the display text rather than a slug.
type CommandEntry = {
	icon?: typeof FileText;
	url: string;
	value: string;
};

type CommandEntryGroup = {
	items: CommandEntry[];
	value: string;
};

const GROUPS: CommandEntryGroup[] = [
	{
		items: NAV_ITEMS.map((item) => ({
			icon: item.icon,
			url: item.url,
			value: item.title,
		})),
		value: "Pages",
	},
	{
		items: NOTES.map((note) => ({
			url: `/note/${note.id}`,
			value: note.title,
		})),
		value: "Notes",
	},
];

const COMMAND_PALETTE_SHORTCUT = "k";

export function CommandPalette({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}): React.ReactNode {
	const navigate = useNavigate();

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
				<Command items={GROUPS}>
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
												className="gap-2"
												key={item.url}
												onClick={() => {
													onOpenChange(false);
													void navigate(item.url);
												}}
												value={item}
											>
												{item.icon && (
													<item.icon className="size-4 shrink-0 text-muted-foreground" />
												)}
												<span className="truncate">{item.value}</span>
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
