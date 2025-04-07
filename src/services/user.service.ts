import { User } from "@prisma/client";
import { UserRepository, UserRepositoryImpl } from "@/repositories";
import { AppError } from "@/middlewares";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepositoryImpl()) {
    this.userRepository = userRepository;
  }

  async findAll() {
    return this.userRepository.findAll();
  }

  async findById(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }
    return user;
  }

  async update(
    id: number,
    data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return this.userRepository.update(id, data);
  }

  async delete(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    await this.userRepository.delete(id);
  }
}
