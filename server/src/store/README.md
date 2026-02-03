# Store Pattern - Database Layer

This directory contains the database access layer using the **Store Pattern**. All database operations are centralized here, keeping the GraphQL resolvers clean and focused on business logic.

## Architecture

```
src/store/
├── index.ts          # Exports all stores
├── todoStore.ts      # Todo-related database operations
└── userStore.ts      # User-related database operations
```

## Store Classes

### TodoStore
Handles all Todo-related database operations:

- `getAllTodos()` - Fetch all todos with user data
- `getTodoById(id)` - Fetch single todo by ID
- `createTodo(title, userId)` - Create new todo
- `updateTodo(id, title?, completed?)` - Update existing todo
- `deleteTodo(id)` - Delete todo

### UserStore
Handles all User-related database operations:

- `getAllUsers()` - Fetch all users
- `getUserById(id)` - Fetch single user by ID
- `getUserByEmail(email)` - Fetch user by email
- `createUser(name, email)` - Create new user
- `updateUser(id, name?, email?)` - Update existing user
- `deleteUser(id)` - Delete user

## Usage in Resolvers

```typescript
import { TodoStore, UserStore } from '../store';

const resolvers = {
  Query: {
    getTodos: async () => await TodoStore.getAllTodos(),
    getTodo: async (_: any, { id }) => await TodoStore.getTodoById(id),
  },
  Mutation: {
    createTodo: async (_: any, { title, userId }) =>
      await TodoStore.createTodo(title, userId),
  },
};
```

## Benefits

1. **Separation of Concerns**: Database logic separated from GraphQL logic
2. **Reusability**: Store methods can be used across different resolvers
3. **Testability**: Easy to unit test database operations
4. **Type Safety**: Full TypeScript support with interfaces
5. **Maintainability**: Centralized database operations

## Error Handling

All store methods include proper error handling and throw descriptive error messages that can be caught by GraphQL error handling.

## Future Extensions

- Add transaction support for complex operations
- Implement caching layer
- Add database connection pooling optimizations
- Create base Store class for common functionality