import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes, postRoutes, categoryRoutes } from "@/routes";
import { errorHandler } from "@/middlewares";

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/api/status", (req, res) => {
  res.status(200).json({ status: "API running" });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
