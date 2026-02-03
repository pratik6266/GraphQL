# GraphQL Todo Application

A full-stack GraphQL todo application with React frontend and Node.js backend, fully containerized with Docker.

## 🏗 Architecture

```
┌─────────────────┐
│  Frontend       │
│  (React + Vite) │
│  Port: 3000     │
└────────┬────────┘
         │ GraphQL
         ▼
┌─────────────────┐
│  Backend        │
│  (Apollo + Express)
│  Port: 4000     │
└────────┬────────┘
         │ SQL
         ▼
┌─────────────────┐      ┌─────────────┐
│  PostgreSQL     │◄─────┤  Flyway     │
│  Port: 5432     │      │  Migrations │
└─────────────────┘      └─────────────┘
```

## 📁 Project Structure

```
├── client/graphql-client/          # Frontend application
│   ├── src/
│   │   ├── routes/                 # TanStack Router routes
│   │   │   ├── todos/              # Todo CRUD pages
│   │   │   │   ├── index.tsx       # List todos
│   │   │   │   ├── create.tsx      # Create todo
│   │   │   │   ├── $id.tsx         # View todo
│   │   │   │   └── $id_.edit.tsx   # Edit/Delete todo
│   │   │   └── __root.tsx          # Root layout
│   │   ├── graphql/                # GraphQL queries & mutations
│   │   ├── lib/                    # GraphQL client config
│   │   ├── components/             # React components
│   │   └── styles.css              # Global styles
│   ├── Dockerfile                  # Frontend container
│   └── nginx.conf                  # Production web server
│
├── server/                         # Backend application
│   ├── src/
│   │   ├── index.ts               # Apollo Server setup
│   │   ├── database.ts            # PostgreSQL connection
│   │   └── store/                 # Data access layer
│   │       ├── todoStore.ts       # Todo operations
│   │       └── userStore.ts       # User operations
│   ├── migrations/                # Database migrations
│   │   └── V1__Initial_schema.sql
│   └── Dockerfile                 # Backend container
│
├── docker-compose.yaml            # Full stack orchestration
└── Makefile                       # Automation commands
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Make (optional but recommended)
- pnpm (for local development)

### Using Makefile (Recommended)

```bash
# Development mode
make dev                # Start all services in dev mode
make dev-logs          # View logs
make dev-down          # Stop dev services

# Production mode
make build             # Build all images
make prod              # Start production stack
make prod-logs         # View production logs
make prod-down         # Stop production stack

# Database operations
make db-connect        # Connect to PostgreSQL
make db-reset          # Reset database
make db-backup         # Backup database
make db-restore        # Restore database

# Individual services
make backend-dev       # Start backend only
make frontend-dev      # Start frontend only
make backend-logs      # View backend logs
make frontend-logs     # View frontend logs

# Cleanup
make clean             # Remove containers & networks
make prune             # Deep clean (volumes, images)
make clean-all         # Complete reset

# Health & Status
make health            # Check all services
make ps                # List running containers
```

### Manual Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

### Local Development (Without Docker)

#### Backend
```bash
cd server
pnpm install
pnpm dev
```

#### Frontend
```bash
cd client/graphql-client
pnpm install
pnpm dev
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
```

#### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_db
DB_USER=postgres
DB_PASSWORD=postgres
PORT=4000
```

## 📦 Docker Services

### Database (PostgreSQL)
- **Port**: 5432
- **Container**: `todo_postgres`
- **Volume**: `postgres_data`
- **Health Check**: pg_isready

### Flyway (Migrations)
- **Container**: `todo_flyway`
- **Runs**: On startup only
- **Purpose**: Apply database migrations

### Backend (Apollo Server)
- **Port**: 4000
- **Container**: `todo_backend`
- **Health Check**: GraphQL endpoint
- **Depends On**: Database

### Frontend (React + Nginx)
- **Port**: 3000
- **Container**: `todo_frontend`
- **Web Server**: Nginx (Alpine)
- **Depends On**: Backend

## 📝 GraphQL API

### Queries

#### Get All Todos
```graphql
query GetTodos {
  getTodos {
    id
    title
    completed
    user {
      id
      name
      email
    }
  }
}
```

**Example Command:**
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query GetTodos { getTodos { id title completed user { id name email } } }"}'
```

#### Get Single Todo
```graphql
query GetTodo($id: Int!) {
  getTodo(id: $id) {
    id
    title
    completed
    user {
      id
      name
      email
    }
  }
}
```

**Example Command:**
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query GetTodo($id: Int!) { getTodo(id: $id) { id title completed user { id name email } } }", "variables": {"id": 1}}'
```

### Mutations

#### Create Todo
```graphql
mutation CreateTodo($title: String!, $userId: Int!) {
  createTodo(title: $title, userId: $userId) {
    id
    title
    completed
    user {
      id
      name
      email
    }
  }
}
```

**Example Command:**
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation CreateTodo($title: String!, $userId: Int!) { createTodo(title: $title, userId: $userId) { id title completed user { id name email } } }", "variables": {"title": "Learn GraphQL", "userId": 1}}'
```

#### Update Todo
```graphql
mutation UpdateTodo($id: Int!, $title: String, $completed: Boolean) {
  updateTodo(id: $id, title: $title, completed: $completed) {
    id
    title
    completed
    user {
      id
      name
      email
    }
  }
}
```

**Example Command:**
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation UpdateTodo($id: Int!, $title: String, $completed: Boolean) { updateTodo(id: $id, title: $title, completed: $completed) { id title completed user { id name email } } }", "variables": {"id": 1, "title": "Updated title", "completed": true}}'
```

#### Delete Todo
```graphql
mutation DeleteTodo($id: Int!) {
  deleteTodo(id: $id)
}
```

**Example Command:**
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation DeleteTodo($id: Int!) { deleteTodo(id: $id) }", "variables": {"id": 1}}'
```

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19
- **Router**: TanStack Router 1.132.0
- **State**: TanStack Query 5.90.20
- **GraphQL**: graphql-request 7.4.0
- **Styling**: Tailwind CSS 4.0.6
- **Build**: Vite 7.3.1
- **Server**: Nginx (production)

### Backend
- **Runtime**: Node.js 20
- **Language**: TypeScript 5.9.3
- **GraphQL**: Apollo Server 5.3.0
- **Web**: Express 5.2.1
- **Database**: PostgreSQL
- **ORM**: pg (node-postgres)
- **Migrations**: Flyway

### DevOps
- **Container**: Docker & Docker Compose
- **Package Manager**: pnpm 10.25.0
- **Automation**: GNU Make

## 🔍 Available Routes

- `/` - Home page
- `/todos` - List all todos
- `/todos/create` - Create new todo
- `/todos/:id` - View todo details
- `/todos/:id/edit` - Edit/delete todo

## 🧪 Testing

### GraphQL Playground
Access the GraphQL playground at: http://localhost:4000/graphql

### Frontend
Access the application at: http://localhost:3000

### Database
```bash
make db-connect
# Or manually:
docker exec -it todo_postgres psql -U postgres -d todo_db
```

## 📊 Monitoring

### View Logs
```bash
# All services
make logs

# Specific service
make backend-logs
make frontend-logs
make db-logs
```

### Health Checks
```bash
make health
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :4000
lsof -i :5432

# Kill the process
kill -9 <PID>
```

### Database Connection Issues
```bash
# Reset database
make db-reset

# Check database status
make health
```

### Container Issues
```bash
# Restart containers
make restart

# Full cleanup and rebuild
make clean
make build
make prod
```

### Frontend Not Loading
```bash
# Clear browser cache
# Check backend is running:
curl http://localhost:4000/graphql

# Rebuild frontend
docker-compose up -d --build frontend
```

## 🚢 Deployment

### Production Build
```bash
make build
make prod
```

### Environment Variables
Update `.env` files in both `client/graphql-client` and `server` directories with production values.

### Docker Compose Override
Create `docker-compose.override.yaml` for production-specific configurations.

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📚 Documentation

- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [graphql-request](https://github.com/jasonkuhrt/graphql-request)

## 🎯 Features

- ✅ Full CRUD operations for todos
- ✅ GraphQL API
- ✅ Type-safe with TypeScript
- ✅ Responsive UI with Tailwind CSS
- ✅ File-based routing
- ✅ Optimistic updates
- ✅ Database migrations
- ✅ Docker containerization
- ✅ Health checks
- ✅ Production-ready Nginx config
- ✅ Multi-stage Docker builds
- ✅ Automated Makefile commands
