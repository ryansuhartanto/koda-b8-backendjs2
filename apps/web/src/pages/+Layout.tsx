import { Ellipsis, SquarePen } from "lucide-react";
import { Outlet, useLocation } from "react-router";

import { AppSidebar, NAV_ITEMS } from "#/components/app-sidebar";
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

export default function Layout(): React.ReactNode {
	const title = useTitle();

	return (
		<SidebarProvider>
			<AppSidebar />
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
					<div className="ms-auto flex items-center gap-2">
						<Button
							size="sm"
							variant="outline"
						>
							<SquarePen />
							<span className="max-sm:hidden">New note</span>
						</Button>
						<Button
							aria-label="More options"
							size="icon"
							variant="ghost"
						>
							<Ellipsis />
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
