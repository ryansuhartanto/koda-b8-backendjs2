import { Router } from "express";

import * as auth from "#/controllers/auth.controller";

export const authRouter: Router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [auth]
 *     summary: Register an account
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Session" }
 *       "400":
 *         description: Missing name, email or password
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 *       "409":
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 */
authRouter.post("/register", auth.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [auth]
 *     summary: Exchange credentials for a token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Session" }
 *       "400":
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 *       "401":
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 */
authRouter.post("/login", auth.login);
