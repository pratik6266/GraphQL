# GraphQL Server

A modern GraphQL API server built with TypeScript, Apollo Server v5, PostgreSQL, and Flyway migrations.

## 🏗️ Architecture

```
server/
├── src/
│   ├── store/              # Database access layer (Store Pattern)
│   │   ├── index.ts        # Store exports
│   │   ├── todoStore.ts    # Todo database operations
│   │   └── userStore.ts    # User database operations
│   ├── database.ts         # PostgreSQL connection pool
│   └── index.ts            # Apollo Server + Express setup
├── migrations/             # Flyway database migrations
│   ├── V1__Initial_schema.sql
│   └── README.md
├── docker-compose.yaml     # PostgreSQL + Flyway services
├── .env                    # Environment configuration
├── package.json
├── tsconfig.json
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+)
- **Docker** & Docker Compose
- **pnpm** (recommended)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Database

```bash
# Start PostgreSQL + Flyway (runs migrations automatically)
docker compose up -d
```

### 3. Configure Environment

Create `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=graphql_db
DB_USER=graphql_user
DB_PASSWORD=graphql_password
```

### 4. Start Development Server

```bash
# Development mode (with ts-node)
pnpm run dev

# Or build and run production version
pnpm run build && pnpm run start
```

### 5. Access GraphQL Playground

Visit: **`http://localhost:4000/graphql`**

## 📊 Database Schema

### Tables

**Users**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Todos**
```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sample Data

The initial migration includes:
- **Users**: John Doe, Jane Smith
- **Todos**: Sample todos linked to users

## 🔧 API Documentation

### GraphQL Endpoint
- **URL**: `http://localhost:4000/graphql`
- **Method**: POST
- **Content-Type**: `application/json`

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
    }
  }
}
```

#### Delete Todo
```graphql
mutation DeleteTodo($id: Int!) {
  deleteTodo(id: $id)
}
```

## 🗂️ Project Structure Details

### Source Code (`src/`)

#### Store Pattern (`src/store/`)
Database access layer using the Store Pattern for clean separation of concerns.

**TodoStore** - Todo operations:
- `getAllTodos()` - Fetch all todos with user data
- `getTodoById(id)` - Fetch single todo
- `createTodo(title, userId)` - Create new todo
- `updateTodo(id, title?, completed?)` - Update todo
- `deleteTodo(id)` - Delete todo

**UserStore** - User operations:
- `getAllUsers()` - Fetch all users
- `getUserById(id)` - Fetch single user
- `createUser(name, email)` - Create new user
- `updateUser(id, name?, email?)` - Update user
- `deleteUser(id)` - Delete user

#### Database Connection (`src/database.ts`)
PostgreSQL connection pool configuration with environment variables.

#### GraphQL Server (`src/index.ts`)
Apollo Server v5 setup with Express integration, schema definition, and resolvers.

### Database (`migrations/`)

Flyway-managed SQL migrations with versioned files:
- `V1__Initial_schema.sql` - Initial database schema and sample data

### Configuration Files

- **`package.json`** - Dependencies and scripts
- **`tsconfig.json`** - TypeScript configuration
- **`docker-compose.yaml`** - Database services
- **`.env`** - Environment variables (not committed)

## 🛠️ Development Commands

### Database Operations

```bash
# Start database services
docker compose up -d

# Stop database services
docker compose down

# View database logs
docker compose logs -f database

# Run migrations manually
pnpm run db:migrate

# Clean database (removes all data)
pnpm run db:clean
```

### Server Operations

```bash
# Development mode (auto-reload)
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start

# Type checking
pnpm run build
```

### Docker Operations

```bash
# View running containers
docker compose ps

# Access database directly
docker exec -it graphql_postgres_db psql -U graphql_user -d graphql_db

# View migration history
docker exec -it graphql_postgres_db psql -U graphql_user -d graphql_db -c "SELECT * FROM flyway_schema_history;"
```

## 🔒 Environment Configuration

### Required Environment Variables

Create a `.env` file in the server root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=graphql_db
DB_USER=graphql_user
DB_PASSWORD=graphql_password

# Optional: Server Configuration
PORT=4000
NODE_ENV=development
```

### Environment Files

- **`.env`** - Local development (not committed)
- **`.env.example`** - Template for other developers

## 🧪 Testing

### Manual Testing

1. Start the server: `pnpm run dev`
2. Visit `http://localhost:4000/graphql`
3. Use Apollo Studio to test queries and mutations

### Sample Test Data

```graphql
# Create a test todo
mutation {
  createTodo(title: "Test GraphQL API", userId: 1) {
    id
    title
    completed
  }
}

# Query all todos
query {
  getTodos {
    id
    title
    completed
    user {
      name
      email
    }
  }
}
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
pnpm run build

# Start production server
pnpm run start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker compose -f docker-compose.prod.yml up -d
```

### Environment Setup

Ensure these environment variables are set in production:
- `NODE_ENV=production`
- Database connection details
- Any other production-specific configs

## 📚 Technologies Used

### Core Framework
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **Express 5** - Web framework

### GraphQL
- **Apollo Server v5** - GraphQL server
- **@as-integrations/express5** - Express integration

### Database
- **PostgreSQL 18** - Relational database
- **pg (node-postgres)** - PostgreSQL client
- **Flyway** - Database migration tool

### Development Tools
- **pnpm** - Package manager
- **ts-node** - TypeScript execution
- **Docker** - Containerization
- **ESLint** - Code linting (if configured)

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Check if database is running
docker compose ps

# View database logs
docker compose logs database

# Test database connection
docker exec -it graphql_postgres_db psql -U graphql_user -d graphql_db -c "SELECT version();"
```

### Migration Issues

```bash
# Check migration status
docker compose logs flyway

# Reset database and rerun migrations
docker compose down -v  # Remove volumes
docker compose up -d    # Fresh start
```

### GraphQL Errors

```bash
# Check server logs
pnpm run dev

# Verify database has data
docker exec -it graphql_postgres_db psql -U graphql_user -d graphql_db -c "SELECT * FROM users;"
```

### Port Conflicts

If port 5432 or 4000 is busy:
- Change ports in `docker-compose.yaml`
- Update `.env` file
- Update connection strings

## 🤝 Contributing

1. Follow the existing code structure
2. Add database operations to the store layer
3. Update GraphQL schema for new features
4. Add proper TypeScript types
5. Test with GraphQL Playground

## 📄 License

This project is licensed under the ISC License.

---

**Happy coding! 🚀**

For more information, check the [main project README](../README.md).