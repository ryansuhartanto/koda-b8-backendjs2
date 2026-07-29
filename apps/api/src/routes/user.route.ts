import { Router } from "express";

import * as users from "#/controllers/user.controller";

export const userRouter: Router = Router();

userRouter.get("/", users.getAll);
userRouter.get("/:id", users.getId);
userRouter.patch("/:id", users.patch);
userRouter.delete("/:id", users.del);
