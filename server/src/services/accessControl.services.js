import { AccessControl } from 'accesscontrol'
import { PermissionRoles } from '../models'

/*
    Documentation: https://www.npmjs.com/package/accesscontrol

    To check permissions using ac in any endpoint you should use the following format:
    ac.cant(<user.role>).createAny(<resource_name>) where user.role is the id of the
    assigned role and resource_name the mongoose collection name of the resource.
*/
const ac = new AccessControl()

const updateAccessControl = async () => {
    const roles = await PermissionRoles.find()
    const parsedRoles = {}

    /*
        Format should be:
        {
            <role._id>: {
                <resource_name>: {
                    <premission_type>: [<accesses>]
                }
            }
        }
    */
    roles?.forEach((role) => {
        parsedRoles[role._id] = role.resources
    })

    ac.setGrants(parsedRoles)
}

/*
    Allows to create a role with a name (should be a generic name to translate in frontend)
    and a resources object that should follow the format example shown in models/permissionRole.js
*/
const createRole = async (name, resources) => {
    try {
        const newRole = new PermissionRoles({
            name,
            resources
        })

        await newRole.save()
        await updateAccessControl()
        return newRole
    } catch (error) {
        throw new Error(error.message)
    }
}

/*
    Deletes a role using it's id.
    Needs modification to add error message delivery in case of catching
    an exception thrown by findByIdAndDelete
*/
const deleteRole = async (roleId) => {
    try {
        await PermissionRoles.findByIdAndDelete(roleId)
        return true
    } catch (error) {
        // Add error message to be sent
        throw new Error()
    }
}

/*
    Updates a role using it's id and a new resources object, this object will completely replace the old
    one so it needs to have all the attributes setted for the role.
    Needs modification to add error message delivery in case of catching
    an exception thrown by findByIdAndDelete
*/
const updateRole = async (roleId, newResources) => {
    try {
        const updated = await PermissionRoles.findByIdAndUpdate(roleId, { resources: newResources }, { new: true })
        return updated
    } catch (error) {
        // Add error message to be sent
        throw new Error()
    }
}

export default {
    ac,
    createRole,
    deleteRole,
    updateRole,
    updateAccessControl
}
