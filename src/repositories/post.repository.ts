import { Post } from "@prisma/client";
import prisma from "@/config/prisma";
import { BaseRepository } from "@/repositories";

export interface PostRepository extends BaseRepository<Post> {
  findBySlug(slug: string): Promise<Post | null>;
  findByAuthor(authorId: number): Promise<Post[]>;
  findByCategory(categoryId: number): Promise<Post[]>;
  findPublished(): Promise<Post[]>;
  incrementViews(id: number): Promise<Post>;
}

export class PostRepositoryImpl implements PostRepository {
  async findAll(): Promise<Post[]> {
    return prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            avatar: true,
            password: false,
          },
        },
        category: true,
        tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            avatar: true,
            password: false,
          },
        },
        category: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                password: false,
              },
            },
          },
        },
        tags: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            avatar: true,
            password: false,
          },
        },
        category: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                password: false,
              },
            },
          },
        },
        tags: true,
      },
    });
  }

  async findByAuthor(authorId: number): Promise<Post[]> {
    return prisma.post.findMany({
      where: {
        authorId,
      },
      include: {
        category: true,
        tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }

  async findByCategory(categoryId: number): Promise<Post[]> {
    return prisma.post.findMany({
      where: {
        categoryId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            password: false,
          },
        },
        tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }

  async findPublished(): Promise<Post[]> {
    return prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            password: false,
          },
        },
        category: true,
        tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(
    data: Omit<Post, "id" | "createdAt" | "updatedAt">
  ): Promise<Post> {
    return prisma.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            password: false,
          },
        },
        category: true,
      },
    });
  }

  async update(
    id: number,
    data: Partial<Omit<Post, "id" | "createdAt" | "updatedAt">>
  ): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            password: false,
          },
        },
        category: true,
        tags: true,
      },
    });
  }

  async incrementViews(id: number): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
  }
}
