import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { TodoStore } from './store';

const typeDefs = `
  type Todo {
    id: Int!,
    title: String,
    completed: Boolean,
    user: User!
  }

  type User {
    id: Int!,
    name: String,
    email: String
  }

  type Query {
    getTodos: [Todo],
    getTodo(id: Int!): Todo
  }

  type Mutation {
    createTodo(title: String!, userId: Int!): Todo
    updateTodo(id: Int!, title: String, completed: Boolean): Todo
    deleteTodo(id: Int!): Boolean
  }
`;

const resolvers = {
  Query: {
    getTodos: async () => {
      return await TodoStore.getAllTodos();
    },
    getTodo: async (_: any, { id }: { id: number }) => {
      return await TodoStore.getTodoById(id);
    },
  },
  Mutation: {
    createTodo: async (_: any, { title, userId }: { title: string; userId: number }) => {
      return await TodoStore.createTodo(title, userId);
    },
    updateTodo: async (_: any, { id, title, completed }: { id: number; title?: string; completed?: boolean }) => {
      return await TodoStore.updateTodo(id, title, completed);
    },
    deleteTodo: async (_: any, { id }: { id: number }) => {
      return await TodoStore.deleteTodo(id);
    },
  },
};

async function startServer() {
  try {
    const app = express();
    const PORT = process.env.PORT || 4000;

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await server.start();

    app.use(cors());
    app.use(express.json());

    app.use('/graphql', expressMiddleware(server));

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch(console.error);

