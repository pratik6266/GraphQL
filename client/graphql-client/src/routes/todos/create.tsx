import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/todos/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/todos/create"!</div>
}
