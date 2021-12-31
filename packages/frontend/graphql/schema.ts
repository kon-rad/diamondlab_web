// graphql/schema.ts

import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type project {
    id: String
    title: String
    description: String
    url: String
    twitter: String
    discord: String
    category: String
    imageUrl: String
    website: String
    contractAddress: String
    notes: String
  }
`