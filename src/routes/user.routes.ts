import { Router } from "express";
import { UserController } from "@/controllers";
import { authenticate, authorizeAdmin } from "@/middlewares";

const router = Router();
const userController = new UserController();

// Rotas protegidas por autenticação
router.get("/", authenticate, userController.getAllUsers);
router.get("/:id", authenticate, userController.getUserById);
router.put(
  "/:id",
  authenticate,
  userController.updateValidation,
  userController.validateRequest,
  userController.updateUser
);
router.delete("/:id", authenticate, authorizeAdmin, userController.deleteUser);

export const userRoutes = router;
