<div align="center">
  <h1>💰 FinTrack API</h1>
  <p><strong>API Backend</strong> para gerenciamento de clientes e cobranças</p>
  
  [![Node.js](https://img.shields.io/badge/Node.js-v16+-green?style=flat-square)](https://nodejs.org)
  [![Express](https://img.shields.io/badge/Express-v5.2-black?style=flat-square)](https://expressjs.com)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v12+-blue?style=flat-square)](https://www.postgresql.org)
  [![JWT](https://img.shields.io/badge/JWT-Auth-orange?style=flat-square)](https://jwt.io)
</div>

---

## 📋 Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológico](#stack-tecnológico)
- [Começar Rápido](#começar-rápido)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [API Endpoints](#api-endpoints)
- [Autenticação](#autenticação)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 📝 Sobre

**FinTrack API** é uma API RESTful robusta desenvolvida em Node.js com Express, projetada para gerenciar clientes e cobranças. O projeto foi desenvolvido como desafio final do módulo 5 e implementa boas práticas de desenvolvimento backend como:

- ✅ Autenticação segura com JWT
- ✅ Validação de dados com Yup
- ✅ Senhas criptografadas com Bcrypt
- ✅ Tratamento de erros global
- ✅ CORS configurado
- ✅ Estrutura escalável e modular

### 🔗 Links Úteis

- **[Frontend Repository](https://github.com/sadyvit/fintrack)** - Interface web da aplicação
- **[Live Demo](https://desafio-final-front-seven.vercel.app/)** - Aplicação em produção

---

## ⭐ Funcionalidades

### Usuários
- 👤 Cadastro de novos usuários
- 🔐 Login com geração de token JWT
- 📝 Visualizar dados do usuário autenticado
- ✏️ Editar informações do perfil

### Clientes
- ➕ Criar novo cliente
- 📊 Listar todos os clientes
- 🔍 Buscar cliente por ID ou termo
- ✏️ Editar dados do cliente
- 🗑️ Remover cliente

### Cobranças
- 📌 Criar cobrança vinculada a cliente
- 📋 Listar todas as cobranças
- 🔍 Buscar cobrança por ID ou filtros
- ✏️ Atualizar status/dados da cobrança
- 🗑️ Deletar cobrança

---

## 🛠 Stack Tecnológico

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **Node.js** | LTS | Runtime JavaScript |
| **Express** | ^5.2.1 | Framework web |
| **PostgreSQL** | 14+ | Banco de dados relacional |
| **Knex.js** | ^3.1.0 | Query builder SQL |
| **JWT** | ^9.0.3 | Autenticação segura |
| **Bcrypt** | ^6.0.0 | Hash de senhas |
| **Yup** | ^1.7.1 | Validação de schemas |
| **CORS** | ^2.8.5 | Compartilhamento de recursos |
| **Dotenv** | ^17.2.3 | Variáveis de ambiente |
| **Nodemon** | ^3.1.11 | Auto-reload em desenvolvimento |

---

## 🚀 Começar Rápido

### Pré-requisitos
- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/sadyvit/fintrack_api.git
cd fintrack_api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

4. **Execute as migrations do banco de dados**
```bash
npm run migrate
```

5. **Inicie o servidor**
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

O servidor estará disponível em `http://localhost:3333`

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3333
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario_postgres
DB_PASS=sua_senha_postgres
DB_NAME=fintrack_db

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Banco de Dados

Execute o arquivo SQL para criar as tabelas:

```bash
psql -U seu_usuario -d fintrack_db -f script.sql
```

Ou configure via variáveis de ambiente e execute as migrations do Knex.

---

## 📁 Estrutura de Pastas

```
fintrack_api/
├── src/
│   ├── index.js                 # Inicialização do servidor Express
│   ├── rotas.js                 # Definição de todas as rotas
│   ├── bancodedados/
│   │   └── conexao.js          # Configuração de conexão com BD
│   ├── controladores/           # Lógica dos endpoints
│   │   ├── usuario.js
│   │   ├── login.js
│   │   ├── clientes.js
│   │   └── cobrancas.js
│   ├── filtros/                 # Middlewares de autenticação
│   │   └── filtroLogin.js
│   └── validacoes/              # Schemas de validação (Yup)
│       ├── cadastroUsuarioSchema.js
│       ├── cadastroClienteSchema.js
│       ├── cadastrarCobrancaSchema.js
│       ├── editarUsuarioSchema.js
│       ├── loginSchema.js
│       └── yup.js
├── script.sql                   # Migrations do banco de dados
├── test-db-conn.js             # Teste de conexão com BD
├── package.json
├── vercel.json                  # Configuração para deploy
├── .env.example                 # Exemplo de variáveis de ambiente
└── README.md
```

---

## 🔌 API Endpoints

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/usuario` | Cadastrar novo usuário | ❌ |
| POST | `/login` | Login e gerar token JWT | ❌ |

### Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/usuario` | Obter dados do usuário logado | ✅ |
| PUT | `/usuario` | Editar dados do usuário | ✅ |

### Clientes

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/clientes` | Criar novo cliente | ✅ |
| GET | `/clientes` | Listar todos os clientes | ✅ |
| GET | `/clientes/:id` | Obter cliente por ID | ✅ |
| GET | `/clientes/busca` | Buscar clientes por termo | ✅ |
| PUT | `/clientes/:id` | Atualizar cliente | ✅ |

### Cobranças

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/cobrancas` | Criar nova cobrança | ✅ |
| GET | `/cobrancas` | Listar todas as cobranças | ✅ |
| GET | `/cobrancas/:id` | Obter cobrança por ID | ✅ |
| GET | `/cobrancas/busca` | Buscar cobranças por filtros | ✅ |
| PUT | `/cobrancas/:id` | Editar cobrança | ✅ |
| DELETE | `/cobrancas/:id` | Deletar cobrança | ✅ |

### Status Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Health check do servidor |

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. 

### Fluxo de Autenticação

1. Usuário faz login em `/login` com email e senha
2. Servidor valida credenciais e retorna um token JWT
3. Cliente armazena o token no localStorage/sessionStorage
4. Em requisições subsequentes, o token é enviado no header:

```
Authorization: Bearer seu_token_jwt_aqui
```

### Exemplo de Requisição Autenticada

```bash
curl -X GET http://localhost:3333/usuario \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Middleware de Validação

O middleware `validarUsuarioLogado` valida o token em todas as rotas protegidas:

```javascript
rotas.use(validarUsuarioLogado); // Ativa proteção para rotas abaixo
```

---

## 🧪 Testes

Para testar a conexão com o banco de dados:

```bash
node test-db-conn.js
```

---

## 📦 Deploy

### Vercel

A aplicação está configurada para deploy na Vercel. Basta:

1. Conectar seu repositório GitHub à Vercel
2. Adicionar variáveis de ambiente no painel
3. Fazer push para a branch principal

Ver arquivo `vercel.json` para configuração.

### Variáveis de Ambiente em Produção

```env
DB_HOST=seu-host-render-ou-aws
DB_PORT=5432
DB_USER=usuario_producao
DB_PASS=senha_segura_producao
DB_NAME=fintrack_production
JWT_SECRET=chave_super_segura_producao
NODE_ENV=production
```