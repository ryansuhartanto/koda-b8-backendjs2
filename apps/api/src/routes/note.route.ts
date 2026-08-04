import { Router } from "express";

import * as notes from "#/controllers/note.controller";

export const noteRouter: Router = Router();

/**
 * @openapi
 * /notes:
 *   get:
 *     tags: [notes]
 *     summary: List the notes of the signed in user
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: "#/components/schemas/Note" }
 *       "401":
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 */
noteRouter.get("/", notes.getAll);

/**
 * @openapi
 * /notes/{id}:
 *   get:
 *     tags: [notes]
 *     summary: Read one note
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
 *             schema: { $ref: "#/components/schemas/Note" }
 *       "401":
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 *       "404":
 *         description: Note not found or owned by someone else
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 */
noteRouter.get("/:id", notes.getId);

/**
 * @openapi
 * /notes:
 *   post:
 *     tags: [notes]
 *     summary: Write a note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               body: { type: string }
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Note" }
 *       "400":
 *         description: Missing title
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 *       "401":
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 */
noteRouter.post("/", notes.post);

/**
 * @openapi
 * /notes/{id}:
 *   patch:
 *     tags: [notes]
 *     summary: Edit a note
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
 *               title: { type: string }
 *               body: { type: string }
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Note" }
 *       "401":
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 *       "404":
 *         description: Note not found or owned by someone else
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 */
noteRouter.patch("/:id", notes.patch);

/**
 * @openapi
 * /notes/{id}:
 *   delete:
 *     tags: [notes]
 *     summary: Throw a note away
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
 *         description: Note not found or owned by someone else
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Error" }
 */
noteRouter.delete("/:id", notes.del);
