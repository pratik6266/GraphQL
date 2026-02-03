import pool from '../database';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface TodoWithUser {
  id: number;
  title: string;
  completed: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export class TodoStore {
  static async getAllTodos(): Promise<TodoWithUser[]> {
    try {
      const query = `
        SELECT
          t.id,
          t.title,
          t.completed,
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email
          ) as user
        FROM todos t
        JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw new Error('Failed to fetch todos');
    }
  }

  static async getTodoById(id: number): Promise<TodoWithUser | null> {
    try {
      const query = `
        SELECT
          t.id,
          t.title,
          t.completed,
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email
          ) as user
        FROM todos t
        JOIN users u ON t.user_id = u.id
        WHERE t.id = $1
      `;
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching todo:', error);
      throw new Error('Failed to fetch todo');
    }
  }

  static async createTodo(title: string, userId: number): Promise<TodoWithUser> {
    try {
      const query = `
        WITH inserted_todo AS (
          INSERT INTO todos (title, user_id)
          VALUES ($1, $2)
          RETURNING id, title, completed, user_id
        )
        SELECT
          it.id,
          it.title,
          it.completed,
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email
          ) as user
        FROM inserted_todo it
        JOIN users u ON it.user_id = u.id
      `;
      const { rows } = await pool.query(query, [title, userId]);
      return rows[0];
    } catch (error) {
      console.error('Error creating todo:', error);
      throw new Error('Failed to create todo');
    }
  }

  static async updateTodo(id: number, title?: string, completed?: boolean): Promise<TodoWithUser | null> {
    try {
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (title !== undefined) {
        updates.push(`title = $${paramCount}`);
        values.push(title);
        paramCount++;
      }

      if (completed !== undefined) {
        updates.push(`completed = $${paramCount}`);
        values.push(completed);
        paramCount++;
      }

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      const query = `
        UPDATE todos
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING
          todos.id,
          todos.title,
          todos.completed,
          json_build_object(
            'id', users.id,
            'name', users.name,
            'email', users.email
          ) as user
        FROM users
        WHERE todos.id = $${paramCount} AND todos.user_id = users.id
      `;
      values.push(id);

      const { rows } = await pool.query(query, values);
      return rows[0] || null;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw new Error('Failed to update todo');
    }
  }

  static async deleteTodo(id: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM todos WHERE id = $1 RETURNING id';
      const { rowCount } = await pool.query(query, [id]);
      return (rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw new Error('Failed to delete todo');
    }
  }
}