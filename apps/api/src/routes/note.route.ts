import { Router } from "express";

import * as notes from "#/controllers/note.controller";

export const noteRouter: Router = Router();

noteRouter.get("/", notes.getAll);
noteRouter.get("/:id", notes.getId);
noteRouter.post("/", notes.post);
noteRouter.patch("/:id", notes.patch);
noteRouter.delete("/:id", notes.del);
