import { GraphQLObjectType } from 'graphql'
import { UserQueries } from './user'

const RootQuery = new GraphQLObjectType({
    name: 'Queries',
    description: '',
    fields: {
        ...UserQueries
    }
})

export default RootQuery
