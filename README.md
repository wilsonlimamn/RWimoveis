# RWimóveis - Imobiliária Digital & Painel CRM

Sistema completo fullstack para imobiliárias e corretores autônomos, com catálogo de imóveis, captação de leads, funil de vendas Kanban drag-and-drop, métricas e integração com banco de dados PostgreSQL.

---

## 1. Executando com Docker

### Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/) (20.10+)
- [Docker Compose](https://docs.docker.com/compose/) (v2+)

### Opção A: Modo Padrão (PostgreSQL Embutido via Compose)

Sobe o container do banco PostgreSQL (`postgres:16-alpine`) e a aplicação Node.js juntos. O `schema.sql` (estrutura e usuário admin com hash bcrypt) é aplicado automaticamente na primeira inicialização:

```bash
# Subir aplicação + banco de dados embutido
docker compose up -d --build
```

- A aplicação estará acessível em: `http://localhost:3000`
- O PostgreSQL estará exposto na porta `5432`

---

### Opção B: Usando PostgreSQL Externo (Fora do Compose / RDS / Cloud SQL / Neon / Supabase)

Se você já possui uma instância PostgreSQL gerenciada ou rodando em outro servidor/container, **não precisa subir o serviço `postgres` do compose**.

Você pode executar apenas o serviço `app` apontando para o seu `DATABASE_URL`:

#### Passo 1: Aplicar a estrutura no seu PostgreSQL externo
Execute o script `schema.sql` no seu banco externo para criar as tabelas e índices necessários:

```bash
psql "postgres://seu_usuario:sua_senha@seu-host-postgres:5432/seu_banco?sslmode=require" -f schema.sql
```

*(Opcional)* Se desejar carregar os imóveis de demonstração com fotos:
```bash
psql "postgres://seu_usuario:sua_senha@seu-host-postgres:5432/seu_banco?sslmode=require" -f seed_demo.sql
```

#### Passo 2: Subir apenas o serviço `app` sem o container de banco

Existem duas formas simples de rodar apenas a aplicação:

**Forma 1: Via arquivo `.env` (Recomendado)**
Crie ou edite o arquivo `.env` na raiz do projeto:
```env
DATABASE_URL=postgres://seu_usuario:sua_senha@host_do_seu_banco:5432/nome_do_banco?sslmode=require
ADMIN_USER=admin
ADMIN_PASSWORD=sua_senha_segura
```

E inicie apenas o serviço `app` com a flag `--no-deps`:
```bash
docker compose up -d --no-deps --build app
```

**Forma 2: Passando a variável diretamente no comando**
```bash
DATABASE_URL="postgres://seu_usuario:sua_senha@host_do_seu_banco:5432/nome_do_banco" docker compose up -d --no-deps --build app
```

**Forma 3: Rodando via `docker run` avulso**
```bash
docker build -t rwimoveis .
docker run -d \
  --name rwimoveis_app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgres://seu_usuario:sua_senha@host_do_seu_banco:5432/nome_do_banco" \
  -e ADMIN_USER="admin" \
  -e ADMIN_PASSWORD="sua_senha_segura" \
  rwimoveis
```

---

## 2. Segurança & Autenticação (Bcrypt)

- O painel administrativo utiliza criptografia **bcrypt (10 rounds)** para armazenamento e conferência de senhas.
- Nenhuma senha é gravada ou comparada em texto puro.
- A seed inicial em `schema.sql` insere a conta padrão com o hash bcrypt:
  - **Usuário Padrão**: `admin`
  - **Senha Padrão**: `121212`
  - **Hash Bcrypt Gerado**: `$2b$10$UR6dR0Kw2VIZowl3gIdpROei3I7bzixn3Jle.O0mEnApCoph0JD.u`
- Para alterar a senha do admin em produção, basta definir a variável de ambiente `ADMIN_PASSWORD="sua_nova_senha"` no `.env` ou container.

---

## 3. Estrutura dos Arquivos SQL

| Arquivo | Finalidade |
|---|---|
| `schema.sql` | **Estrutura DDL Limpa**: Criação de extensões, tabelas (`admin_users`, `properties`, `leads`, `visits`), chaves estrangeiras, índices de performance e o usuário admin inicial com hash bcrypt. **Ideal para ambientes de produção**. |
| `seed_demo.sql` | **Dados de Exemplo**: Insere 6 imóveis fictícios com fotos de alta resolução, preços, condomínio e descrições detalhadas. Pode ser aplicado opcionalmente para testes e apresentações. |

---

## 4. Desenvolvimento Local (sem Docker)

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (Vite + Express)
npm run dev

# Build de produção
npm run build

# Iniciar build de produção
npm start
```

---

## 5. Endpoints Principais da API

- `POST /api/auth/login`: Autenticação administrativa com comparação de hash `bcrypt`.
- `GET /api/properties`: Listagem de imóveis com filtros por tipo, finalidade, preço e busca textual.
- `GET /api/crm/leads`: Listagem de leads com status do funil Kanban.
- `PATCH /api/crm/leads/:id`: Atualização de etapa (Kanban drag-and-drop), anotações e valores.
- `GET /api/analytics`: Métricas de conversão, pipeline e visualizações por imóvel/data.
- `GET /api/schema.sql`: Download do DDL PostgreSQL de produção.
- `GET /api/seed_demo.sql`: Download dos dados de demonstração.
