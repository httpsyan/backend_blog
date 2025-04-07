import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "@/middlewares/error.middleware";

// Interface para expandir o tipo Request e incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token não fornecido", 401);
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    throw new AppError("Formato de token inválido", 401);
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    throw new AppError("Formato de token inválido", 401);
  }

  try {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new AppError("Erro de configuração do servidor", 500);
    }

    const decoded = jwt.verify(token, secretKey);

    req.user = decoded as {
      id: number;
      role: string;
    };

    return next();
  } catch (error) {
    throw new AppError("Token inválido", 401);
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new AppError("Usuário não autenticado", 401);
  }

  if (req.user.role !== "ADMIN") {
    throw new AppError("Acesso negado: permissão insuficiente", 403);
  }

  return next();
};
