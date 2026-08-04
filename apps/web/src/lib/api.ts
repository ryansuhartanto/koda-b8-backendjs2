import { toastManager } from "#/components/ui/toast";

const url = (import.meta.env["VITE_API_URL"] ??
	"http://localhost:3000") as string;

export async function fetchApi(
	input: string,
	init?: RequestInit,
): Promise<Response> {
	return fetch(url + input, init);
}

export async function apiCall<T>(
	token: string,
	input: string,
	init?: RequestInit,
): Promise<T> {
	const headers = new Headers(init?.headers);
	headers.set("authorization", `Bearer ${token}`);
	const res = await fetchApi(input, { ...init, headers });
	if (!res.ok) {
		const { error } = (await res.json()) as { error: string };
		toastManager.add({ title: error, type: "error" });
		throw new Error(error);
	}
	return res.json() as Promise<T>;
}
