import { Router } from "express";
import { PostController } from "@/controllers";
import { authenticate, authorizeAdmin } from "@/middlewares";

const router = Router();
const postController = new PostController();

// Rotas públicas
router.get("/", postController.getPublishedPosts);
router.get("/all", authenticate, authorizeAdmin, postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.get("/slug/:slug", postController.getPostBySlug);
router.get("/author/:authorId", postController.getPostsByAuthor);
router.get("/category/:categoryId", postController.getPostsByCategory);

// Rotas protegidas
router.post(
  "/",
  authenticate,
  postController.createPostValidation,
  postController.validateRequest,
  postController.createPost
);

router.put(
  "/:id",
  authenticate,
  postController.updatePostValidation,
  postController.validateRequest,
  postController.updatePost
);

router.delete("/:id", authenticate, postController.deletePost);

export const postRoutes = router;
