import swaggerJsdoc from "swagger-jsdoc";

export const openapi: unknown = swaggerJsdoc({
	definition: {
		openapi: "3.1.0",
		info: {
			title: "Notes API",
			version: "1.0.0",
			description: "Notes for signed in users.",
			license: { name: "MIT" },
		},
		servers: [{ url: `http://localhost:${process.env["API_PORT"] ?? "3000"}` }],
		security: [{ bearerAuth: [] }],
		components: {
			securitySchemes: {
				bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
			},
			schemas: {
				User: {
					type: "object",
					properties: {
						id: { type: "integer" },
						name: { type: "string" },
						email: { type: "string", format: "email" },
					},
				},
				Session: {
					type: "object",
					properties: {
						token: { type: "string" },
						user: { $ref: "#/components/schemas/User" },
					},
				},
				Note: {
					type: "object",
					properties: {
						"id": { type: "integer" },
						"id-user": { type: "integer" },
						"title": { type: "string" },
						"body": { type: "string" },
					},
				},
				Error: {
					type: "object",
					properties: {
						error: { type: "string" },
						field: {
							type: "string",
							description: "Input the error belongs to, when it is one input.",
						},
					},
					required: ["error"],
				},
			},
		},
	},
	apis: [`${import.meta.dirname}/../routes/*.ts`],
});
