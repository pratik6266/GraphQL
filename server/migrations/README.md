# Database Migrations with Flyway

This project uses Flyway for database schema migrations. Flyway automatically runs migrations when the Docker containers start up.

## Migration Files

Migration files are located in the `migrations/` directory and follow Flyway naming conventions:

- `V{version}__{description}.sql`
- Example: `V1__Initial_schema.sql`

## Running Migrations

### Automatic (Recommended)
Migrations run automatically when you start the containers:

```bash
docker compose up -d
```

### Manual Migration Commands

```bash
# Run migrations
pnpm run db:migrate

# Clean database (removes all data and schemas)
pnpm run db:clean #! WARNING BE EXTREME SURE
```

## Adding New Migrations

1. Create a new SQL file in the `migrations/` directory
2. Follow the naming pattern: `V{next_version}__{description}.sql`
3. Write your SQL DDL/DML statements
4. Run migrations: `docker compose up flyway` or `pnpm run db:migrate`

## Migration History

Flyway tracks migration history in the `flyway_schema_history` table in your database.

## Example Migration File

```sql
-- V2__Add_user_roles.sql
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES user_roles(id);
```