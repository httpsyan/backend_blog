import { Post } from "@prisma/client";
import { PostRepository, PostRepositoryImpl } from "@/repositories";
import { AppError } from "@/middlewares";
import { generateSlug } from "@/utils";

interface CreatePostDTO {
  title: string;
  content: string;
  excerpt?: string;
  published?: boolean;
  featuredImage?: string;
  authorId: number;
  categoryId: number;
}

interface UpdatePostDTO {
  title?: string;
  content?: string;
  excerpt?: string;
  published?: boolean;
  featuredImage?: string;
  categoryId?: number;
}

export class PostService {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository = new PostRepositoryImpl()) {
    this.postRepository = postRepository;
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.findAll();
  }

  async getPublishedPosts(): Promise<Post[]> {
    return this.postRepository.findPublished();
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new AppError("Post não encontrado", 404);
    }
    return post;
  }

  async getPostBySlug(slug: string): Promise<Post> {
    const post = await this.postRepository.findBySlug(slug);
    if (!post) {
      throw new AppError("Post não encontrado", 404);
    }

    // Incrementa o contador de visualizações
    await this.postRepository.incrementViews(post.id);

    return post;
  }

  async getPostsByAuthor(authorId: number): Promise<Post[]> {
    return this.postRepository.findByAuthor(authorId);
  }

  async getPostsByCategory(categoryId: number): Promise<Post[]> {
    return this.postRepository.findByCategory(categoryId);
  }

  async createPost(postData: CreatePostDTO): Promise<Post> {
    const {
      title,
      content,
      excerpt,
      published,
      featuredImage,
      authorId,
      categoryId,
    } = postData;

    // Gera o slug a partir do título
    const slug = generateSlug(title);

    // Verifica se já existe um post com o mesmo slug
    const existingPost = await this.postRepository.findBySlug(slug);
    if (existingPost) {
      throw new AppError("Já existe um post com título similar", 400);
    }

    return this.postRepository.create({
      title,
      slug,
      content,
      excerpt,
      published: published !== undefined ? published : false,
      featuredImage,
      authorId,
      categoryId,
      views: 0,
    } as Post);
  }

  async updatePost(id: number, postData: UpdatePostDTO): Promise<Post> {
    // Verifica se o post existe
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new AppError("Post não encontrado", 404);
    }

    // Prepara os dados para atualização
    const updateData: Partial<Post> = { ...postData };

    // Se o título for atualizado, gera um novo slug
    if (postData.title) {
      const newSlug = generateSlug(postData.title);

      // Verifica se o novo slug já existe (diferente do slug atual)
      if (newSlug !== post.slug) {
        const existingPost = await this.postRepository.findBySlug(newSlug);
        if (existingPost && existingPost.id !== id) {
          throw new AppError("Já existe um post com título similar", 400);
        }
        updateData.slug = newSlug;
      }
    }

    return this.postRepository.update(id, updateData);
  }

  async deletePost(id: number): Promise<void> {
    // Verifica se o post existe
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new AppError("Post não encontrado", 404);
    }

    await this.postRepository.delete(id);
  }
}
