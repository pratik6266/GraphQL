# Todo App - GraphQL Client

A modern Todo application built with React, TanStack Router, TanStack Query, and GraphQL.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Header.tsx      # Navigation header with sidebar
├── graphql/            # GraphQL queries and mutations
│   └── queries.ts      # Centralized GraphQL operations
├── lib/                # Utility libraries
│   └── graphql-client.ts  # GraphQL client configuration
├── routes/             # Application routes (file-based routing)
│   ├── __root.tsx      # Root layout with QueryClientProvider
│   ├── index.tsx       # Home page
│   └── todos/          # Todo-related routes
│       ├── index.tsx   # List all todos (GET)
│       ├── create.tsx  # Create new todo (POST)
│       ├── $id.tsx     # View single todo (GET)
│       └── $id_.edit.tsx  # Edit/Delete todo (PUT/DELETE)
├── router.tsx          # Router configuration
├── routeTree.gen.ts    # Auto-generated route tree
└── styles.css          # Global styles (Tailwind CSS)
```

## 🚀 Features

- **CRUD Operations**: Complete Create, Read, Update, Delete functionality for todos
- **GraphQL Integration**: Communicates with backend via GraphQL API
- **Type-Safe Routing**: TanStack Router with auto-generated types
- **Smart Data Fetching**: TanStack Query for caching and state management
- **Responsive UI**: Tailwind CSS for styling
- **Real-time Updates**: Automatic cache invalidation after mutations

## 📋 Routes

| Route | Description | Operations |
|-------|-------------|------------|
| `/` | Home page | - |
| `/todos` | List all todos | GET todos |
| `/todos/create` | Create new todo | POST todo |
| `/todos/:id` | View todo details | GET single todo |
| `/todos/:id/edit` | Edit/Delete todo | PUT/DELETE todo |

## 🔌 API Integration

### GraphQL Endpoint
```
http://localhost:4000/graphql
```

### Available Operations

#### Queries
- `getTodos` - Fetch all todos with user info
- `getTodo(id: Int!)` - Fetch single todo by ID

#### Mutations
- `createTodo(title: String!, userId: Int!)` - Create new todo
- `updateTodo(id: Int!, title: String, completed: Boolean)` - Update todo
- `deleteTodo(id: Int!)` - Delete todo

## 🛠️ Tech Stack

- **React 19** - UI library
- **TanStack Router** - Type-safe file-based routing
- **TanStack Query** - Server state management
- **GraphQL Request** - Lightweight GraphQL client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Vite** - Build tool & dev server

## 📦 Installation

```bash
pnpm install
```

## 🏃 Development

Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

**Note**: Make sure the backend GraphQL server is running on `http://localhost:4000/graphql`

## 🔧 Configuration

### GraphQL Client
Located in `src/lib/graphql-client.ts`:
```typescript
const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql'
```

### Query Client
Configured in `src/routes/__root.tsx` with default settings for caching and refetching.

## 📝 Usage Examples

### Viewing Todos
1. Navigate to `/todos`
2. See list of all todos with user information
3. Click "View" to see details
4. Click "Edit" to modify or delete

### Creating a Todo
1. Click "Create New Todo" button
2. Enter title and user ID
3. Submit form
4. Redirects to todos list

### Editing a Todo
1. Navigate to todo detail or click "Edit"
2. Modify title or toggle completion status
3. Click "Update Todo" to save
4. Or click "Delete Todo" to remove (with confirmation)

## 🎨 Styling

Uses Tailwind CSS v4 with custom configuration. Main color scheme:
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Background: Gray shades (#1F2937, #111827)

## 🔒 Best Practices

1. **Centralized GraphQL Operations**: All queries/mutations in `graphql/queries.ts`
2. **Type Safety**: Leverages TypeScript and TanStack Router's type generation
3. **Cache Management**: Automatic invalidation after mutations
4. **Error Handling**: Displays errors from both queries and mutations
5. **Loading States**: Shows loading indicators during async operations
6. **Optimistic Updates**: Immediate UI feedback with cache invalidation

## 🐛 Troubleshooting

### Routes not updating
Delete `.tanstack/tmp` directory and restart dev server to regenerate route tree.

### GraphQL errors
1. Ensure backend server is running
2. Check GRAPHQL_ENDPOINT in `lib/graphql-client.ts`
3. Verify network connectivity

### Build errors
```bash
pnpm clean  # if available
rm -rf node_modules .tanstack
pnpm install
```

## 📄 License

ISC
