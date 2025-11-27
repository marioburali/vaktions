import { Router } from "express";
import userController from "../controllers/user.controller";
import { adminOnly } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.get("/email/:email", userController.getUserByEmail);
router.post("/", adminOnly, userController.createUser);
router.put("/:id", adminOnly, userController.editUser);
router.delete("/:id", adminOnly, userController.deleteUser);

export default router;
