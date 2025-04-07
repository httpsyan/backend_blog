import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { UserService } from "@/services";
import { AppError } from "@/middlewares";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Middlewares de validação
  updateValidation = [
    body("name").optional().notEmpty().withMessage("Nome não pode estar vazio"),
    body("email").optional().isEmail().withMessage("E-mail inválido"),
    body("bio").optional().isString().withMessage("Bio deve ser uma string"),
    body("avatar").optional().isString().withMessage("Avatar deve ser uma string"),
  ];

  validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }
    next();
  };

  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.userService.findAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.findById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.update(id, req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.userService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
} 