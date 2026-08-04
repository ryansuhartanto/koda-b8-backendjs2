import {
	ChevronsUpDown,
	FileText,
	Lightbulb,
	LogOut,
	Search,
	SquarePen,
	Trash2,
} from "lucide-react";
import { Link, useLocation } from "react-router";

import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/components/ui/input-group";
import { Kbd } from "#/components/ui/kbd";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "#/components/ui/menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "#/components/ui/sidebar";

export type NavItem = {
	title: string;
	url: string;
	icon: typeof FileText;
	count?: number;
};

export const NAV_ITEMS: NavItem[] = [
	{ count: 24, icon: FileText, title: "All notes", url: "/" },
	{ icon: Trash2, title: "Trash", url: "/trash" },
];

export function AppSidebar({
	onSearch,
}: {
	onSearch: () => void;
}): React.ReactNode {
	const { pathname } = useLocation();

	return (
		<Sidebar
			variant="inset"
			collapsible="icon"
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							render={<Link to="/" />}
							size="lg"
							tooltip="Notes"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<Lightbulb
									aria-hidden="true"
									className="size-4"
								/>
							</div>
							<div className="grid flex-1 text-left leading-tight">
								<span className="truncate font-medium">Keep</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>

				<Button className="w-full group-data-[collapsible=icon]:hidden">
					<SquarePen aria-hidden="true" />
					New note
				</Button>

				<InputGroup className="group-data-[collapsible=icon]:hidden">
					<InputGroupAddon>
						<Search />
					</InputGroupAddon>
					<InputGroupInput
						aria-label="Search notes"
						onClick={onSearch}
						placeholder="Search notes"
						readOnly
					/>
					<InputGroupAddon align="inline-end">
						<Kbd>⌘K</Kbd>
					</InputGroupAddon>
				</InputGroup>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{NAV_ITEMS.map((item) => (
								<SidebarMenuItem key={item.url}>
									<SidebarMenuButton
										isActive={pathname === item.url}
										render={<Link to={item.url} />}
										tooltip={item.title}
									>
										<item.icon aria-hidden="true" />
										<span>{item.title}</span>
									</SidebarMenuButton>
									{item.count !== undefined && (
										<SidebarMenuBadge>{item.count}</SidebarMenuBadge>
									)}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<Menu>
							<MenuTrigger
								render={
									<SidebarMenuButton
										size="lg"
										tooltip="Account"
									>
										<Avatar className="size-8 rounded-lg">
											<AvatarFallback className="rounded-lg">RS</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left leading-tight">
											<span className="truncate font-medium">Ryan</span>
											<span className="truncate text-muted-foreground text-xs">
												ryan@example.com
											</span>
										</div>
										<ChevronsUpDown className="ms-auto" />
									</SidebarMenuButton>
								}
							/>
							<MenuPopup
								align="start"
								className="w-56"
								side="top"
							>
								<MenuItem
									render={<Link to="/auth" />}
									variant="destructive"
								>
									<LogOut />
									Log out
								</MenuItem>
							</MenuPopup>
						</Menu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
