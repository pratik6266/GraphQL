import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { graphqlClient } from '../../lib/graphql-client'
import { GET_TODOS } from '../../graphql/queries'

export const Route = createFileRoute('/todos/')({
  component: TodosIndex,
})

function TodosIndex() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => graphqlClient.request(GET_TODOS),
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <Link to="/todos/create" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Create New Todo
      </Link>
      <ul className="space-y-2">
        {data.getTodos.map((todo: any) => (
          <li key={todo.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{todo.title}</h2>
              <p>Completed: {todo.completed ? 'Yes' : 'No'}</p>
              <p>User: {todo.user.name}</p>
            </div>
            <div className="space-x-2">
              <Link to="/todos/$id" params={{ id: String(todo.id) }} className="bg-green-500 text-white px-3 py-1 rounded">
                View
              </Link>
              <Link to="/todos/$id/edit" params={{ id: String(todo.id) }} className="bg-yellow-500 text-white px-3 py-1 rounded">
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}