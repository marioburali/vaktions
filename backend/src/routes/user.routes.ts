import { Router } from "express";
import userController from "../controllers/user.controller";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.get("/email/:email", userController.getUserByEmail);
router.post("/", userController.createUser);
router.put("/:id", userController.editUser);
router.delete("/:id", userController.deleteUser);

export default router;
