import { PrismaClient } from "@prisma/client";

// Inicializando o cliente Prisma como um singleton
const prisma = new PrismaClient();

export default prisma;
