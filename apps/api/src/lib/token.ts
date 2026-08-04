import jwt from "jsonwebtoken";

const secret = process.env["JWT_SECRET"] ?? "";

export function sign(idUser: number): string {
	return jwt.sign({}, secret, { subject: String(idUser), expiresIn: "24h" });
}

export function parse(raw: string): number | undefined {
	try {
		const { sub } = jwt.verify(raw, secret, {
			// reject algorithm confusion
			algorithms: ["HS256"],
		}) as jwt.JwtPayload;

		return sub ? Number(sub) : undefined;
	} catch {
		return undefined;
	}
}
