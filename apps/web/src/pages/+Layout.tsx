import { SquarePen } from "lucide-react";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";

import { AppSidebar, NAV_ITEMS } from "#/components/app-sidebar";
import { CommandPalette } from "#/components/command-palette";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "#/components/ui/sidebar";
import { useAuth } from "#/contexts/auth";
import { NotesProvider, useNotes } from "#/contexts/notes";

export function useTitle(): string {
	const { pathname } = useLocation();
	const nav = NAV_ITEMS.find((item) => item.url === pathname);
	if (nav) {
		return nav.title;
	}

	const [kind, slug] = pathname.split("/").filter(Boolean);
	if (slug) {
		return kind === "t" ? `#${slug}` : slug[0]!.toUpperCase() + slug.slice(1);
	}

	return "Notes";
}

function LayoutInner(): React.ReactNode {
	const title = useTitle();
	const { openCreateNote } = useNotes();
	const [searchOpen, setSearchOpen] = React.useState(false);

	return (
		<SidebarProvider>
			<AppSidebar onSearch={() => setSearchOpen(true)} />
			<CommandPalette
				onOpenChange={setSearchOpen}
				open={searchOpen}
			/>
			<SidebarInset>
				<header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
					<SidebarTrigger className="-ms-1" />
					<Separator
						className="me-1 h-4 self-center"
						orientation="vertical"
					/>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>Notes</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{title}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<div className="ms-auto">
						<Button
							size="sm"
							variant="outline"
							onClick={openCreateNote}
						>
							<SquarePen aria-hidden="true" />
							<span className="max-sm:hidden">New note</span>
						</Button>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

export default function Layout(): React.ReactNode {
	const { user } = useAuth();
	if (!user) {
		return (
			<Navigate
				to="/auth"
				replace
			/>
		);
	}
	return (
		<NotesProvider>
			<LayoutInner />
		</NotesProvider>
	);
}
