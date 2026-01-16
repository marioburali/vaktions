import { Router } from "express";
import userController from "../controllers/user.controller";
import { adminOnly } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.get("/email/:email", userController.getUserByEmail);
router.post("/", adminOnly, validate(createUserSchema), userController.createUser);
router.put("/:id", adminOnly, validate(updateUserSchema), userController.editUser);
router.delete("/:id", adminOnly, userController.deleteUser);

export default router;
