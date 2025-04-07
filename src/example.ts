// ======== ANTES: Imports com caminhos relativos ========
// import { authRoutes } from "../routes/auth.routes";
// import { PostService } from "../../services/post.service";
// import { AppError } from "../../../middlewares/error.middleware";
// import prisma from "../../../../config/prisma";
// import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware";

// ======== DEPOIS (1ª versão): Imports com alias @/ mas ainda referenciando arquivos específicos ========
// import { authRoutes } from "@/routes/auth.routes";
// import { PostService } from "@/services/post.service";
// import { AppError } from "@/middlewares/error.middleware";
// import prisma from "@/config/prisma";
// import { authenticate, authorizeAdmin } from "@/middlewares/auth.middleware";

// ======== DEPOIS (2ª versão): Imports com alias @/ + arquivos de barril (index.ts) ========
import { authRoutes, postRoutes, categoryRoutes } from "@/routes";
import { PostService, AuthService, CategoryService } from "@/services";
import { AppError, authenticate, authorizeAdmin } from "@/middlewares";
import prisma from "@/config/prisma";

/**
 * As vantagens do uso de aliases com arquivos de barril (index.ts) são:
 * 
 * 1. Mais legível e limpo
 * 2. Não precisa se preocupar com a profundidade do diretório (../../..)
 * 3. Facilita refatoração e movimentação de arquivos (os caminhos não quebram)
 * 4. Padronização em todo o projeto
 * 5. Reduz erros quando os arquivos estão em níveis diferentes da árvore de diretórios
 * 6. Centraliza as exportações de cada módulo
 * 7. Facilita a manutenção - ao adicionar novas funcionalidades, basta incluí-las no index.ts
 * 8. Simplifica a importação de múltiplos componentes de um mesmo módulo
 */

// Este é apenas um arquivo de exemplo para demonstrar o uso de aliases
// Não possui funcionalidade real no projeto
