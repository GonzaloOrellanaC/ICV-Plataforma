import { GraphQLBoolean, GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { environment } from '../../config'

import { AccessControlServices, UserServices } from '../../services'
import { UsersType } from './'

const { generic: { error: errorMsg } } = environment.messages.schema

export default {
    createUser: {
        description: 'Allows to mutate the database to create a **User** information. Requires administrative create permissions to access.',
        type: UsersType,
        args: {
            email: { type: new GraphQLNonNull(GraphQLString) },
            name: { type: new GraphQLNonNull(GraphQLString) },
            lastName: { type: new GraphQLNonNull(GraphQLString) },
            permissionRole: { type: GraphQLID },
            enabled: { type: GraphQLBoolean }
        },
        async resolve (parent, { name, resources }, { user: { permissionRole } }) {
            const permission = AccessControlServices.check(permissionRole, 'User', 'createAny')
            if (!permission.granted) {
                throw new Error(errorMsg.noPermission)
            }

            // create User
        }
    },
    updateUser: {
        description: 'Allows to mutate the database to update a **User** information. Requires administrative update permissions to access.',
        type: UsersType,
        args: {
            userId: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: GraphQLString },
            lastName: { type: GraphQLString },
            newPermissionRole: { type: GraphQLID },
            enabled: { type: GraphQLBoolean }
        },
        async resolve (parent, { userId, name, lastName, newPermissionRole, enabled }, { user: { _id, permissionRole } }) {
            const isOwned = userId.toString() === _id.toString()
            const permission = isOwned
                ? AccessControlServices.check(permissionRole, 'User', 'updateOwn')
                : AccessControlServices.check(permissionRole, 'User', 'updateAny')
            if (!permission.granted) {
                throw new Error(errorMsg.noPermission)
            }

            // update User
        }
    },
    deleteUser: {
        description: 'Allows to mutate the database to delete a **User**. Requires administrative delete permissions to access.',
        type: UsersType,
        args: {
            userId: { type: new GraphQLNonNull(GraphQLID) }
        },
        async resolve (parent, { userId }, { user: { permissionRole } }) {
            const permission = AccessControlServices.check(permissionRole, 'User', 'deleteAny')
            if (!permission.granted) {
                throw new Error(errorMsg.noPermission)
            }
            return UserServices.deleteUser(userId)
        }
    }
}
