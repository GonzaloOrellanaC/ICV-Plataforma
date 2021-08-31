import { GraphQLObjectType } from 'graphql'
import { PermissionRoleQueries } from './permissionRole'
import { UserQueries } from './user'

const RootQuery = new GraphQLObjectType({
    name: 'Queries',
    description: '',
    fields: {
        ...UserQueries,
        ...PermissionRoleQueries
    }
})

export default RootQuery
