import { Router } from "express";
import { AuthController } from "@/controllers";

const router = Router();
const authController = new AuthController();

// Rota de registro de usuário
router.post(
  "/register",
  authController.registerValidation,
  authController.validateRequest,
  authController.register
);

// Rota de login
router.post(
  "/login",
  authController.loginValidation,
  authController.validateRequest,
  authController.login
);

export const authRoutes = router;
