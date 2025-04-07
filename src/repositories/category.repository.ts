import prisma from "@/config/prisma";
import { BaseRepository } from "@/repositories";
import { Category } from "@prisma/client";
export interface CategoryRepository extends BaseRepository<Category> {
  findBySlug(slug: string): Promise<Category | null>;
}

export class CategoryRepositoryImpl implements CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  }

  async create(
    data: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category> {
    return prisma.category.create({
      data,
    });
  }

  async update(
    id: number,
    data: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>
  ): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }
}
