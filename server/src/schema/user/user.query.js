import { GraphQLList } from 'graphql'

import { Users } from '../../models'
import { UsersType } from './'

export default {
    self: {
        description: 'Allows to query the database for self **Users** information.',
        type: UsersType,
        async resolve (parent, args, { user: { id } }) {
            /* await new Promise(resolve => {
                setTimeout(() => {
                    resolve(2)
                }, 10000)
            }) */
            return Users.findById(id)
        }
    },
    users: {
        description: 'Allows to query the database for **Users**. Requires administrative read permissions to access.',
        type: new GraphQLList(UsersType),
        async resolve (parent, args, context) {
            /* if (permissions.administracion < 1) {
                throw new Error('No tienes permisos para ver usuarios.')
            } */
            const findUsers = await Users.find({})
            return findUsers
        }
    }
}
