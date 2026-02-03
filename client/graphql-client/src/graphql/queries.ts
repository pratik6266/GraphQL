import { gql } from 'graphql-request'

export const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      title
      completed
      user {
        id
        name
      }
    }
  }
`

export const GET_TODO = gql`
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
`

export const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $userId: Int!) {
    createTodo(title: $title, userId: $userId) {
      id
      title
      completed
    }
  }
`

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: Int!, $title: String, $completed: Boolean) {
    updateTodo(id: $id, title: $title, completed: $completed) {
      id
      title
      completed
    }
  }
`

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id)
  }
`
