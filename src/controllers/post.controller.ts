import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { PostService } from "@/services";
import { AppError } from "@/middlewares";

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  // Middlewares de validação
  createPostValidation = [
    body("title").notEmpty().withMessage("Título é obrigatório"),
    body("content").notEmpty().withMessage("Conteúdo é obrigatório"),
    body("categoryId")
      .isNumeric()
      .withMessage("ID da categoria deve ser um número"),
  ];

  updatePostValidation = [
    param("id").isNumeric().withMessage("ID do post deve ser um número"),
    body("title")
      .optional()
      .notEmpty()
      .withMessage("Título não pode ser vazio"),
    body("content")
      .optional()
      .notEmpty()
      .withMessage("Conteúdo não pode ser vazio"),
    body("categoryId")
      .optional()
      .isNumeric()
      .withMessage("ID da categoria deve ser um número"),
  ];

  validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }
    next();
  };

  getAllPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const posts = await this.postService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };

  getPublishedPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const posts = await this.postService.getPublishedPosts();
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };

  getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const post = await this.postService.getPostById(id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  getPostBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { slug } = req.params;
      const post = await this.postService.getPostBySlug(slug);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  getPostsByAuthor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authorId = parseInt(req.params.authorId);
      const posts = await this.postService.getPostsByAuthor(authorId);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };

  getPostsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const posts = await this.postService.getPostsByCategory(categoryId);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };

  createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Inclui o ID do usuário autenticado como autor do post
      if (!req.user) {
        throw new AppError("Usuário não autenticado", 401);
      }

      const postData = {
        ...req.body,
        authorId: req.user.id,
      };

      const post = await this.postService.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  };

  updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const post = await this.postService.updatePost(id, req.body);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.postService.deletePost(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
