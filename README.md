# Backend Blog API

API RESTful para gerenciamento do blog, desenvolvida com Node.js, Express, TypeScript e Prisma.

## Tecnologias

- **Node.js**: Ambiente de execução
- **TypeScript**: Linguagem com tipagem estática
- **Express**: Framework para construção de APIs
- **Prisma**: ORM para acesso ao banco de dados
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação baseada em tokens
- **bcrypt**: Criptografia de senhas

## Arquitetura

O projeto segue uma arquitetura limpa com separação de responsabilidades:

- **Controllers**: Manipulação de requisições e respostas HTTP
- **Services**: Lógica de negócios
- **Repositories**: Acesso ao banco de dados
- **Middlewares**: Funções intermediárias para tratamento de requisições
- **Routes**: Definição de rotas da API
- **Utils**: Funções utilitárias
- **Config**: Configurações do sistema

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Criar as tabelas no banco de dados
npm run prisma:migrate

# Gerar o cliente Prisma
npm run prisma:generate

# Iniciar em modo desenvolvimento
npm run dev
```

## Endpoints

### Autenticação

- `POST /api/auth/register`: Registro de novo usuário
- `POST /api/auth/login`: Login de usuário

### Posts

- `GET /api/posts`: Lista todos os posts publicados
- `GET /api/posts/all`: Lista todos os posts (requer admin)
- `GET /api/posts/:id`: Obtém post por ID
- `GET /api/posts/slug/:slug`: Obtém post por slug
- `GET /api/posts/author/:authorId`: Lista posts por autor
- `GET /api/posts/category/:categoryId`: Lista posts por categoria
- `POST /api/posts`: Cria novo post (requer autenticação)
- `PUT /api/posts/:id`: Atualiza post (requer autenticação)
- `DELETE /api/posts/:id`: Remove post (requer autenticação)

## Desenvolvimento

O projeto está estruturado para ser escalável, seguindo princípios SOLID e padrões de arquitetura limpa. O Prisma ORM facilita a interação com o banco de dados PostgreSQL, oferecendo segurança e type-safety.

Para adicionar novos recursos, siga o padrão existente:

1. Defina os modelos no schema do Prisma
2. Crie os repositórios para acesso ao banco
3. Implemente os serviços com a lógica de negócios
4. Desenvolva os controladores para lidar com as requisições
5. Configure as rotas no Express
