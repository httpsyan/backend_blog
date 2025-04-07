import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository, UserRepositoryImpl } from "@/repositories";
import { AppError } from "@/middlewares";
import { User } from "@prisma/client";

interface AuthDTO {
  email: string;
  password: string;
}

interface RegisterDTO extends AuthDTO {
  name: string;
}

interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepositoryImpl()) {
    this.userRepository = userRepository;
  }

  async register(userData: RegisterDTO): Promise<AuthResponse> {
    const { name, email, password } = userData;

    // Verifica se o usuário já existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError("Usuário já existe com este e-mail", 400);
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: "USER",
    } as User);

    // Gera o token JWT
    const token = this.generateToken(user);

    // Remove a senha do objeto de retorno
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async login(credentials: AuthDTO): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Busca o usuário pelo e-mail
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    // Gera o token JWT
    const token = this.generateToken(user);

    // Remove a senha do objeto de retorno
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  private generateToken(user: User): string {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new AppError("Erro de configuração do servidor (JWT_SECRET)", 500);
    }

    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secretKey,
      {
        expiresIn: "1d",
      }
    );
  }
}
