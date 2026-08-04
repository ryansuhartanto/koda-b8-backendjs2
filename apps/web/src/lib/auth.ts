export type User = { id: number; name: string; email: string };

export function getUser(): User | undefined {
	const raw = localStorage.getItem("user");
	return raw ? (JSON.parse(raw) as User) : undefined;
}

export function setUser(user: User): void {
	localStorage.setItem("user", JSON.stringify(user));
}

export function clearUser(): void {
	localStorage.removeItem("user");
}
