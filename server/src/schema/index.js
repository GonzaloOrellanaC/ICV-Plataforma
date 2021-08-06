import { GraphQLSchema } from 'graphql'

import Queries from './queries'

const Schema = new GraphQLSchema({
    query: Queries
})

export default Schema
