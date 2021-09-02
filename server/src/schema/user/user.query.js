import { GraphQLList } from 'graphql'
import { environment } from '../../config'

import { Users } from '../../models'
import { AccessControlServices } from '../../services'
import { UsersType } from './'

const { generic: { error: errorMsg } } = environment.messages.schema

export default {
    self: {
        description: 'Allows to query the database for self **Users** information.',
        type: UsersType,
        async resolve (parent, args, { user: { id } }) {
            return Users.findById(id)
        }
    },
    users: {
        description: 'Allows to query the database for **Users**. Requires administrative read permissions to access.',
        type: new GraphQLList(UsersType),
        async resolve (parent, args, { user: { permissionRole } }) {
            const permission = AccessControlServices.check(permissionRole, 'User', 'readAny')
            if (!permission.granted) {
                throw new Error(errorMsg.noPermission)
            }
            const findUsers = await Users.find({})
            return findUsers
        }
    }
}
