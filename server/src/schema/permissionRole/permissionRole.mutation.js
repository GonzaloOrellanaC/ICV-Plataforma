import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import { environment } from '../../config'

import { AccessControlServices } from '../../services'
import { PermissionRolesType, ResourceAccessInputType } from './'

const { generic: { error: errorMsg } } = environment.messages.schema

export default {
    createPermissionRole: {
        description: 'Allows to mutate the database to create a **PermissionRole** information. Requires administrative create permissions to access.',
        type: PermissionRolesType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            resources: { type: new GraphQLList(ResourceAccessInputType) }
        },
        async resolve (parent, { name, resources }, { user: { permissionRole } }) {
            const permission = AccessControlServices.check(permissionRole, 'PermissionRole', 'createAny')
            if (!permission.granted) {
                throw new Error(errorMsg.noPermission)
            }
            const parsedResources = {}
            resources.forEach(resource => {
                if (!parsedResources[resource.resourceName]) {
                    parsedResources[resource.resourceName] = {}
                }

                parsedResources[resource.resourceName] = {
                    ...parsedResources[resource.resourceName],
                    [`${resource.resourceAction}`]: resource.resourceAttributes
                }
            })

            return AccessControlServices.createRole(name, parsedResources)
        }
    },
    updatePermissionRole: {
        description: 'Allows to mutate the database to update a **PermissionRole** information. Requires administrative update permissions to access.',
        type: PermissionRolesType,
        args: {
            roleId: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: GraphQLString },
            resources: { type: new GraphQLList(ResourceAccessInputType) }
        },
        async resolve (parent, { roleId, name, resources }, { user: { permissionRole } }) {
            const permission = AccessControlServices.check(permissionRole, 'PermissionRole', 'updateAny')
            if (!permission.granted) {
                throw new Error(errorMsg.noPermission)
            }
            const parsedResources = {}
            resources.forEach(resource => {
                if (!parsedResources[resource.resourceName]) {
                    parsedResources[resource.resourceName] = {}
                }

                parsedResources[resource.resourceName] = {
                    ...parsedResources[resource.resourceName],
                    [`${resource.resourceAction}`]: resource.resourceAttributes
                }
            })

            return AccessControlServices.updateRole(roleId, parsedResources)
        }
    },
    deletePermissionRole: {
        description: 'Allows to mutate the database to delete a **PermissionRoles**. Requires administrative delete permissions to access.',
        type: PermissionRolesType,
        args: {
            roleId: { type: new GraphQLNonNull(GraphQLID) }
        },
        async resolve (parent, { roleId }, { user: { permissionRole } }) {
            const permission = AccessControlServices.check(permissionRole, 'PermissionRole', 'deleteAny')
            if (!permission.granted) {
                throw new Error(errorMsg.noPermission)
            }
            return AccessControlServices.deleteRole(roleId)
        }
    }
}
