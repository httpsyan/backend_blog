import { Category } from "@prisma/client";
import { CategoryRepository, CategoryRepositoryImpl } from "@/repositories";
import { AppError } from "@/middlewares";
import { generateSlug } from "@/utils";

interface CreateCategoryDTO {
  name: string;
  description?: string;
}

interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor(
    categoryRepository: CategoryRepository = new CategoryRepositoryImpl()
  ) {
    this.categoryRepository = categoryRepository;
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }
    return category;
  }

  async createCategory(categoryData: CreateCategoryDTO): Promise<Category> {
    const { name, description } = categoryData;

    // Gera o slug a partir do nome
    const slug = generateSlug(name);

    // Verifica se já existe uma categoria com o mesmo slug
    const existingCategory = await this.categoryRepository.findBySlug(slug);
    if (existingCategory) {
      throw new AppError("Já existe uma categoria com nome similar", 400);
    }

    return this.categoryRepository.create({
      name,
      slug,
      description,
    } as Category);
  }

  async updateCategory(
    id: number,
    categoryData: UpdateCategoryDTO
  ): Promise<Category> {
    // Verifica se a categoria existe
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }

    // Prepara os dados para atualização
    const updateData: Partial<Category> = { ...categoryData };

    // Se o nome for atualizado, gera um novo slug
    if (categoryData.name) {
      const newSlug = generateSlug(categoryData.name);

      // Verifica se o novo slug já existe (diferente do slug atual)
      if (newSlug !== category.slug) {
        const existingCategory = await this.categoryRepository.findBySlug(
          newSlug
        );
        if (existingCategory && existingCategory.id !== id) {
          throw new AppError("Já existe uma categoria com nome similar", 400);
        }
        updateData.slug = newSlug;
      }
    }

    return this.categoryRepository.update(id, updateData);
  }

  async deleteCategory(id: number): Promise<void> {
    // Verifica se a categoria existe
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }

    try {
      await this.categoryRepository.delete(id);
    } catch (error) {
      throw new AppError(
        "Não é possível excluir esta categoria pois ela possui posts associados",
        400
      );
    }
  }
}
