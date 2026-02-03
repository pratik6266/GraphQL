import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { graphqlClient } from '../../lib/graphql-client'
import { GET_TODO, UPDATE_TODO, DELETE_TODO } from '../../graphql/queries'

export const Route = createFileRoute('/todos/$id_/edit')({
  component: EditTodo,
})

function EditTodo() {
  const params = Route.useParams()
  const id = params.id as string
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { data, isLoading: queryLoading, error: queryError } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => graphqlClient.request(GET_TODO, { id: parseInt(id) }),
  })

  const updateMutation = useMutation({
    mutationFn: (variables: { id: number; title?: string; completed?: boolean }) =>
      graphqlClient.request(UPDATE_TODO, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      queryClient.invalidateQueries({ queryKey: ['todo', id] })
      navigate({ to: '/todos/$id', params: { id } })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (variables: { id: number }) =>
      graphqlClient.request(DELETE_TODO, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      navigate({ to: '/todos' })
    },
  })

  const [title, setTitle] = useState('')
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (data?.getTodo) {
      setTitle(data.getTodo.title)
      setCompleted(data.getTodo.completed)
    }
  }, [data])

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({ id: parseInt(id), title, completed })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      deleteMutation.mutate({ id: parseInt(id) })
    }
  }

  if (queryLoading) return <p className="container mx-auto p-4">Loading...</p>
  if (queryError) return <p className="container mx-auto p-4 text-red-500">Error: {queryError.message}</p>
  if (!data?.getTodo) return <p className="container mx-auto p-4">Todo not found</p>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Todo</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="flex items-center text-sm font-medium">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="mr-2"
            />
            Completed
          </label>
        </div>
        <div className="space-x-2">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Updating...' : 'Update Todo'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Todo'}
          </button>
        </div>
      </form>
      {updateMutation.error && (
        <p className="text-red-500 mt-4">Error: {updateMutation.error.message}</p>
      )}
    </div>
  )
}
