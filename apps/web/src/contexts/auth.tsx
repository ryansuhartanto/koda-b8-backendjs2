import React from "react";

import { fetchApi } from "#/lib/api";
import { clearUser, getUser, setUser } from "#/lib/auth";
import type { User } from "#/lib/auth";

type AuthContext = {
	user: User | undefined;
	login: (email: string, password: string) => Promise<string | undefined>;
	register: (
		name: string,
		email: string,
		password: string,
	) => Promise<string | undefined>;
	logout: () => void;
};

const Ctx = React.createContext<AuthContext | undefined>(undefined);

export function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement {
	const [user, setUserState] = React.useState<User | undefined>(getUser);

	const login = async (
		email: string,
		password: string,
	): Promise<string | undefined> => {
		const res = await fetchApi("/auth/login", {
			method: "POST",
			headers: { "content-type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({ email, password }).toString(),
		});
		if (!res.ok) {
			const { error } = (await res.json()) as { error: string };
			return error;
		}
		const u = (await res.json()) as User;
		setUser(u);
		setUserState(u);
		return undefined;
	};

	const register = async (
		name: string,
		email: string,
		password: string,
	): Promise<string | undefined> => {
		const res = await fetchApi("/auth/register", {
			method: "POST",
			headers: { "content-type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({ name, email, password }).toString(),
		});
		if (!res.ok) {
			const { error } = (await res.json()) as { error: string };
			return error;
		}
		const u = (await res.json()) as User;
		setUser(u);
		setUserState(u);
		return undefined;
	};

	const logout = (): void => {
		clearUser();
		setUserState(undefined);
	};

	return (
		<Ctx.Provider value={{ user, login, register, logout }}>
			{children}
		</Ctx.Provider>
	);
}

export function useAuth(): AuthContext {
	const ctx = React.useContext(Ctx);
	if (!ctx) {
		throw new Error("useAuth must be used inside AuthProvider");
	}
	return ctx;
}
