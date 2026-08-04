import React from "react";

import { fetchApi } from "#/lib/api";
import type { ApiError } from "#/lib/api";
import { clearSession, getSession, setSession } from "#/lib/auth";
import type { Session, User } from "#/lib/auth";

type AuthContext = {
	user: User | undefined;
	token: string | undefined;
	login: (email: string, password: string) => Promise<ApiError | undefined>;
	register: (
		name: string,
		email: string,
		password: string,
	) => Promise<ApiError | undefined>;
	logout: () => void;
};

const Ctx = React.createContext<AuthContext | undefined>(undefined);

export function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement {
	const [session, setSessionState] = React.useState<Session | undefined>(
		getSession,
	);

	const authenticate = async (
		path: string,
		body: Record<string, string>,
	): Promise<ApiError | undefined> => {
		const res = await fetchApi(path, {
			method: "POST",
			headers: { "content-type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams(body).toString(),
		});

		if (!res.ok) {
			return (await res.json()) as ApiError;
		}

		const created = (await res.json()) as Session;
		setSession(created);
		setSessionState(created);
		return undefined;
	};

	const login = async (
		email: string,
		password: string,
	): Promise<ApiError | undefined> =>
		authenticate("/auth/login", { email, password });

	const register = async (
		name: string,
		email: string,
		password: string,
	): Promise<ApiError | undefined> =>
		authenticate("/auth/register", { name, email, password });

	const logout = (): void => {
		clearSession();
		setSessionState(undefined);
	};

	return (
		<Ctx.Provider
			value={{
				user: session?.user,
				token: session?.token,
				login,
				register,
				logout,
			}}
		>
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
