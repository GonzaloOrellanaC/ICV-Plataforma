import { GraphQLObjectType } from 'graphql'
import { PermissionRoleMutations } from './permissionRole'

const RootMutation = new GraphQLObjectType({
    name: 'Mutations',
    description: '',
    fields: {
        ...PermissionRoleMutations
    }
})

export default RootMutation
