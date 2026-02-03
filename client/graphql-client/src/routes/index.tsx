import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-8">Todo App</h1>
      <p className="mb-8">Manage your todos with GraphQL</p>
      <Link to="/todos" className="bg-blue-500 text-white px-6 py-3 rounded text-lg">
        Go to Todos
      </Link>
    </div>
  )
}
