import { Router } from "express";

import * as users from "#/controllers/user.controller";

export const userRouter: Router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [users]
 *     summary: List every user
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: "#/components/schemas/User" }
 *       "401":
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 */
userRouter.get("/", users.getAll);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [users]
 *     summary: Read one user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/User" }
 *       "401":
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 *       "404":
 *         description: User not found
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 */
userRouter.get("/:id", users.getId);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     tags: [users]
 *     summary: Edit a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/User" }
 *       "401":
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 *       "404":
 *         description: User not found
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 *       "409":
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 */
userRouter.patch("/:id", users.patch);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [users]
 *     summary: Delete a user and their notes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       "200":
 *         description: Deleted
 *       "401":
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 *       "404":
 *         description: User not found
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 */
userRouter.delete("/:id", users.del);
