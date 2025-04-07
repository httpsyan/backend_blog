import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { CategoryService } from "@/services";
import { AppError } from "@/middlewares";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  // Middlewares de validação
  createCategoryValidation = [
    body("name").notEmpty().withMessage("Nome é obrigatório"),
  ];

  updateCategoryValidation = [
    param("id").isNumeric().withMessage("ID da categoria deve ser um número"),
    body("name").optional().notEmpty().withMessage("Nome não pode ser vazio"),
  ];

  validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }
    next();
  };

  getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const category = await this.categoryService.getCategoryById(id);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  };

  getCategoryBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { slug } = req.params;
      const category = await this.categoryService.getCategoryBySlug(slug);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const category = await this.categoryService.updateCategory(id, req.body);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.categoryService.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
