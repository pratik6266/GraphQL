.PHONY: help build up down restart logs clean ps migrate db-shell backend-shell frontend-shell dev prod stop

# Default target
help:
	@echo "📋 Todo App - Docker Commands"
	@echo ""
	@echo "🚀 Quick Start:"
	@echo "  make dev          - Start all services in development mode"
	@echo "  make prod         - Start all services in production mode"
	@echo "  make stop         - Stop all services"
	@echo "  make down         - Stop and remove all containers"
	@echo ""
	@echo "🛠️  Development:"
	@echo "  make build        - Build all Docker images"
	@echo "  make up           - Start all services"
	@echo "  make restart      - Restart all services"
	@echo "  make logs         - View logs from all services"
	@echo "  make ps           - List running containers"
	@echo ""
	@echo "🗄️  Database:"
	@echo "  make migrate      - Run database migrations"
	@echo "  make db-shell     - Access PostgreSQL shell"
	@echo "  make db-reset     - Reset database (drop and recreate)"
	@echo ""
	@echo "🐚 Shell Access:"
	@echo "  make backend-shell   - Access backend container shell"
	@echo "  make frontend-shell  - Access frontend container shell"
	@echo ""
	@echo "🧹 Cleanup:"
	@echo "  make clean        - Remove all containers, volumes, and images"
	@echo "  make clean-volumes - Remove only volumes (keeps images)"

# Build all images
build:
	@echo "🔨 Building Docker images..."
	docker compose build

# Start all services
up:
	@echo "🚀 Starting all services..."
	docker compose up -d
	@echo "✅ Services started!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:4000/graphql"
	@echo "   Database: localhost:5432"

# Start in development mode (with logs)
dev:
	@echo "🔧 Starting in development mode..."
	docker compose up

# Start in production mode
prod:
	@echo "🚀 Starting in production mode..."
	docker compose up -d
	@make logs

# Stop all services
stop:
	@echo "⏸️  Stopping all services..."
	docker compose stop

# Stop and remove containers
down:
	@echo "🛑 Stopping and removing containers..."
	docker compose down

# Restart all services
restart:
	@echo "🔄 Restarting services..."
	docker compose restart

# View logs
logs:
	@echo "📋 Viewing logs (Ctrl+C to exit)..."
	docker compose logs -f

# View logs for specific service
logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-db:
	docker compose logs -f database

# List running containers
ps:
	@echo "📦 Running containers:"
	docker compose ps

# Run database migrations
migrate:
	@echo "🔄 Running database migrations..."
	docker compose up flyway
	@echo "✅ Migrations complete!"

# Reset database
db-reset:
	@echo "⚠️  Resetting database..."
	docker compose down -v
	docker compose up -d database
	@sleep 5
	@make migrate
	@echo "✅ Database reset complete!"

# Access database shell
db-shell:
	@echo "🐘 Accessing PostgreSQL shell..."
	docker exec -it todo_postgres psql -U graphql_user -d graphql_db

# Access backend container shell
backend-shell:
	@echo "🐚 Accessing backend container..."
	docker exec -it todo_backend sh

# Access frontend container shell
frontend-shell:
	@echo "🐚 Accessing frontend container..."
	docker exec -it todo_frontend sh

# Clean everything
clean:
	@echo "🧹 Cleaning up everything..."
	docker compose down -v --rmi all
	@echo "✅ Cleanup complete!"

# Clean only volumes
clean-volumes:
	@echo "🧹 Cleaning volumes..."
	docker compose down -v
	@echo "✅ Volumes removed!"

# Health check
health:
	@echo "🏥 Checking service health..."
	@docker compose ps
	@echo ""
	@curl -s http://localhost:4000/graphql -X POST -H "Content-Type: application/json" -d '{"query":"{ __typename }"}' | grep -q "data" && echo "✅ Backend: Healthy" || echo "❌ Backend: Unhealthy"
	@curl -s http://localhost:3000 | grep -q "html" && echo "✅ Frontend: Healthy" || echo "❌ Frontend: Unhealthy"
	@docker exec todo_postgres pg_isready -U graphql_user -d graphql_db > /dev/null 2>&1 && echo "✅ Database: Healthy" || echo "❌ Database: Unhealthy"

# Install dependencies locally (for development without Docker)
install:
	@echo "📦 Installing dependencies..."
	cd server && pnpm install
	cd client/graphql-client && pnpm install
	@echo "✅ Dependencies installed!"

# Development servers (without Docker)
dev-local:
	@echo "🔧 Starting local development servers..."
	@echo "   Terminal 1: cd server && pnpm dev"
	@echo "   Terminal 2: cd client/graphql-client && pnpm dev"

# Backup database
backup:
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	docker exec todo_postgres pg_dump -U graphql_user graphql_db > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup created in backups/ directory"

# Restore database from backup
restore:
	@echo "📥 Restoring database from backup..."
	@read -p "Enter backup file path: " backup_file; \
	docker exec -i todo_postgres psql -U graphql_user -d graphql_db < $$backup_file
	@echo "✅ Database restored!"

# Show environment info
info:
	@echo "ℹ️  Environment Information"
	@echo "=========================="
	@echo "Docker Version: $$(docker --version)"
	@echo "Docker Compose Version: $$(docker compose version)"
	@echo ""
	@echo "📦 Container Status:"
	@docker compose ps
	@echo ""
	@echo "🔗 Service URLs:"
	@echo "   Frontend:  http://localhost:3000"
	@echo "   Backend:   http://localhost:4000/graphql"
	@echo "   Database:  localhost:5432"
