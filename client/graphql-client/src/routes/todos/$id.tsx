import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { graphqlClient } from '../../lib/graphql-client'
import { GET_TODO } from '../../graphql/queries'

export const Route = createFileRoute('/todos/$id')({
  component: TodoDetail,
})

function TodoDetail() {
  const { id } = Route.useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => graphqlClient.request(GET_TODO, { id: parseInt(id) }),
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!data.getTodo) return <p>Todo not found</p>

  const todo = data.getTodo

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo Details</h1>
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold">{todo.title}</h2>
        <p>Completed: {todo.completed ? 'Yes' : 'No'}</p>
        <p>User: {todo.user.name} ({todo.user.email})</p>
      </div>
      <div className="mt-4 space-x-2">
        <Link to="/todos" className="bg-gray-500 text-white px-4 py-2 rounded">
          Back to Todos
        </Link>
        <Link to="/todos/$id/edit" params={{ id }} className="bg-yellow-500 text-white px-4 py-2 rounded">
          Edit
        </Link>
      </div>
    </div>
  )
}