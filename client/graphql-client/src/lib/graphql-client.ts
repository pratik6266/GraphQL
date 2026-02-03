import { request } from 'graphql-request'

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql'

export const graphqlClient = {
  request: (query: string, variables?: any) => 
    request(GRAPHQL_ENDPOINT, query, variables)
}
