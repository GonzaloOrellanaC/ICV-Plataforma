import { GraphQLList } from 'graphql'
import { environment } from '../../config'

import { PermissionRoles } from '../../models'
import { AccessControlServices } from '../../services'
import { PermissionRolesType } from './'

const { generic: { error: errorMsg } } = environment.messages.schema

export default {
    /* selfPermission: {
        description: 'Allows to query the database for self **PermissionRole** information.',
        type: PermissionRolesType,
        async resolve (parent, args, { user: { permissionRole } }) {
            return PermissionRoles.findById(permissionRole)
        }
    },
    permissionRoles: {
        description: 'Allows to query the database for **PermissionRoles**. Requires administrative read permissions to access.',
        type: new GraphQLList(PermissionRolesType),
        async resolve (parent, args, { user: { permissionRole } }) {
            const permission = AccessControlServices.check(permissionRole, 'PermissionRole', 'readAny')
            if (!permission.granted) {
                throw new Error(errorMsg.noPermission)
            }
            const findPermissions = await PermissionRoles.find({})
            return findPermissions
        }
    } */
}
