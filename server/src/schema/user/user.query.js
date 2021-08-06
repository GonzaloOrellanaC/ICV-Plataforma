import { GraphQLList } from 'graphql'

import { Users } from '../../models'
import { UsersType } from './'

export default {
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
