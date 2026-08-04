export type User = { id: number; name: string; email: string };

export type Session = { token: string; user: User };

export function getSession(): Session | undefined {
	const raw = localStorage.getItem("session");
	return raw ? (JSON.parse(raw) as Session) : undefined;
}

export function setSession(session: Session): void {
	localStorage.setItem("session", JSON.stringify(session));
}

export function clearSession(): void {
	localStorage.removeItem("session");
}
