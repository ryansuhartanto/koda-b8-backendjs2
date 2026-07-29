import { M3eAppBar } from "@m3e/react/app-bar";
import { M3eAvatar } from "@m3e/react/avatar";
import { M3eButton } from "@m3e/react/button";
import { M3eFab } from "@m3e/react/fab";
import { M3eIcon } from "@m3e/react/icon";
import { M3eMenu, M3eMenuItem, M3eMenuTrigger } from "@m3e/react/menu";
import { M3eNavBar, M3eNavItem } from "@m3e/react/nav-bar";
import { M3eNavRail } from "@m3e/react/nav-rail";
import { M3eSearchBar } from "@m3e/react/search";
import { M3eRichTooltip, M3eRichTooltipAction } from "@m3e/react/tooltip";
import type React from "react";

function Fab(props: React.ComponentProps<typeof M3eFab>): React.ReactNode {
	return (
		<M3eFab {...props}>
			<M3eIcon name="add" />
			<span slot="label">Add</span>
		</M3eFab>
	);
}

const navItems = [
	{ icon: "lightbulb_2", name: "Notes" },
	{ icon: "delete", name: "Trash" },
];

export function Layout({ children }: React.PropsWithChildren): React.ReactNode {
	const NavItems = navItems.map(({ icon, name }, i) => (
		<M3eNavItem
			key={name}
			selected={i === 0}
		>
			<M3eIcon
				slot="icon"
				name={icon}
			/>
			{name}
		</M3eNavItem>
	));

	return (
		<>
			<nav>
				<M3eNavRail id="nav-rail">
					<Fab size="small" />
					{NavItems}
				</M3eNavRail>
				<M3eNavBar id="nav-bar">
					<Fab />
					{NavItems}
				</M3eNavBar>
			</nav>

			<header>
				<M3eAppBar size="medium">
					<M3eSearchBar
						clearable
						slot="title"
					>
						<M3eIcon
							name="search"
							slot="leading"
						></M3eIcon>
						<input
							slot="input"
							placeholder="Search..."
						/>
						<M3eButton
							slot="trailing"
							id="account"
						>
							<M3eAvatar>AB</M3eAvatar>
						</M3eButton>
					</M3eSearchBar>
				</M3eAppBar>
			</header>

			<M3eRichTooltip htmlFor="account">
				<span slot="subhead">Adam Batch</span>
				<div slot="actions">
					<M3eButton
						variant="outlined"
						style={{ width: "100%" }}
					>
						<M3eRichTooltipAction>Logout</M3eRichTooltipAction>
					</M3eButton>
				</div>
			</M3eRichTooltip>

			<main>{children}</main>
		</>
	);
}
