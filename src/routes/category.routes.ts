import { Router } from "express";
import { CategoryController } from "@/controllers";
import { authenticate, authorizeAdmin } from "@/middlewares";

const router = Router();
const categoryController = new CategoryController();

// Rotas públicas
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.get("/slug/:slug", categoryController.getCategoryBySlug);

// Rotas protegidas (apenas administradores)
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  categoryController.createCategoryValidation,
  categoryController.validateRequest,
  categoryController.createCategory
);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  categoryController.updateCategoryValidation,
  categoryController.validateRequest,
  categoryController.updateCategory
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  categoryController.deleteCategory
);

export const categoryRoutes = router;
