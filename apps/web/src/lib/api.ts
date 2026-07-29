const url = (import.meta.env["VITE_API_URL"] ??
	"http://localhost:3000") as string;

export async function fetchApi(
	input: string,
	init?: RequestInit,
): Promise<Response> {
	return fetch(url + input, init);
}
