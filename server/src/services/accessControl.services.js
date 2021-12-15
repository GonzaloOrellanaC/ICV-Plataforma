import { AccessControl } from 'accesscontrol'
import { UserServices } from '.'
import { environment } from '../config'
import { Permisos, Permission, /* PermissionRoles, */ Roles } from '../models'

const { error: errorMsg } = environment.messages.services.accessControl

/*
    Documentation: https://www.npmjs.com/package/accesscontrol

    To check permissions using ac in any endpoint you should use the following format:
    ac.cant(<user.role>).createAny(<resource_name>) where user.role is the id of the
    assigned role and resource_name the mongoose collection name of the resource.
*/
const ac = new AccessControl()

/**
 * Initiates the Access Control of the server by first creating or updating the adminRole
 * given in the environment configuration object, then it grants all the permissions using
 * function updateAccessControl inside the corresponding function of updateRole or createRole.
 * Logs info to console from the result of this execution
 */
const initAccessControl = async () => {
    try {
        /* const findRole = await PermissionRoles.findOne({ name: environment.adminRole.name }) */
        //const findRoles = await Roles.findOne({ name: environment.roles[0].name })
        let adminResult = '';
        //console.log('Log!!!!!!', findRoles)
        /*if (findRoles.length > 0) {
            //await updateRole(findRoles._id, environment.adminRole.resources)
            //adminResult = 'Admin Role updated'; 
            //createAdminDefault() 
             environment.permisos.forEach(async (permiso, i) => {
                let permissionCreated = await createPermission(permiso.name, permiso.resources);
                if(permissionCreated) {
                    let result2 = `${permiso.name} created`;
                    console.log(result2);
                }
                if(i == (environment.permisos.length - 1)) {
                    createAdminDefault()
                }
            }) 
        } else {
            environment.roles.forEach(async (role, index) => {
                let roleCreated = await createRole(role.name, role.dbName);
                if(roleCreated) {
                    let result = `${role.name} created`;
                    console.log(result);
                    
                }
                if(index == (environment.roles.length - 1)) {
                    environment.permisos.forEach(async (permiso, i) => {
                        let permissionCreated = await createPermission(permiso.name, permiso.resources);
                        if(permissionCreated) {
                            let result2 = `${permiso.name} created`;
                            console.log(result2);
                        }
                        if(i == (environment.permisos.length - 1)) {
                            createAdminDefault()
                        }
                    })
                }
            })
        }*/
    } catch (error) {
        console.error(error)
    }
}

const createAdminDefault = async () => {
    try {
        let newUser = await UserServices.createUser(environment.adminDefaultData, environment.adminDefaultData.password);
        if(newUser) {
            console.log(newUser);
        }
    } catch(error) {
        console.log(error)
    }
}

/* const updateAccessControl = async () => {
    const roles = await PermissionRoles.find()
    const parsedRoles = {}

    
        Format should be:
        {
            <role._id>: {
                <resource_name>: {
                    <premission_type>: [<accesses>]
                }
            }
        }
    
    roles?.forEach((role) => {
        parsedRoles[role._id] = role.resources
    })

    ac.setGrants(parsedRoles)
    return 'Access Control updated'
} */

/**
 * Function to check permissions of a role against the Access Control.
 * @param {*} role Id of the role in DB
 * @param {*} resource Name of the resource given by mongoose collection
 * @param {*} type Type of action over the resource (e.g. createAny or createOwn)
 * @returns AccessControl~Permission, defines the granted or denied access permissions to the target resource and role
 */
const check = (role, resource, type) => {
    switch (type) {
    case 'createAny':
        return ac.can(role.toString()).createAny(resource)
    case 'readAny':
        return ac.can(role.toString()).readAny(resource)
    case 'updateAny':
        return ac.can(role.toString()).updateAny(resource)
    case 'deleteAny':
        return ac.can(role.toString()).deleteAny(resource)
    case 'createOwn':
        return ac.can(role.toString()).createOwn(resource)
    case 'readOwn':
        return ac.can(role.toString()).readOwn(resource)
    case 'updateOwn':
        return ac.can(role.toString()).updateOwn(resource)
    case 'deleteOwn':
        return ac.can(role.toString()).deleteOwn(resource)
    default:
        return ac.can(role.toString()).readAny('NONRESOURCE')
    }
}

/**
 * Allows to create a role with a name (should be a generic name to translate in frontend)
 * and a resources object that should follow the format example shown in models/permissionRole.js.
 * Uses function updateAccessControl to update the Access Control after the successful creation of the role
 * @param {*} name Generic name to use for the role (e.g. admin)
 * @param {*} resources Object with the resource type of access and attributes (e.g. { User: { 'create:any': ['*'], ... } })
 * @returns PermissionRoles, the newly created permission role document
 */
const createRole = async (name, dbName) => {
    try {
        const newRole = new Roles({
            name,
            dbName
        })
        await newRole.save()
        return newRole
    } catch (error) {
        // Add error message to be sent
        throw new Error(error.message)
    }
}

const createPermission = async (name, resources) => {
    try {
        const newPermission = new Permission({
            name,
            resources
        })
        await newPermission.save()
        return newPermission
    } catch (error) {
        // Add error message to be sent
        throw new Error(error.message)
    }
}
/* const createRole = async (name, resources) => {
    try {
        const newRole = new PermissionRoles({
            name,
            resources
        })
        await newRole.save()
        await updateAccessControl()
        return newRole
    } catch (error) {
        // Add error message to be sent
        throw new Error(error.message)
    }
} */

/**
 * Updates a role using it's id and a new resources object, this object will completely replace the old
 * one so it needs to have all the attributes setted for the role.
 * Uses function updateAccessControl to update the Access Control after the successful update of the role
 * @param {*} roleId ID of the role to update in DB
 * @param {*} newResources New Object to replace old resources access definitions. Old definition will change completely
 * @returns PermissionRoles, the updated permission role document
 */
const updateRole = async (roleId, newResources) => {
    try {
        const updated = await PermissionRoles.findByIdAndUpdate(roleId, { resources: newResources }, { new: true });

        //console.log('Actualizado: ', updated)
        if (!updated) {
            throw new Error(errorMsg.roleNotFound)
        }
        await updateAccessControl()
        return updated
    } catch (error) {
        // Add error message to be sent
        throw new Error(error.message)
    }
}

/**
 * Deletes a role using it's id.
 * Uses function updateAccessControl to update the Access Control after the successful deletion of the role
 * @param {*} roleId ID of the role to delete in DB
 * //@returns PermissionRoles, the deleted permission role document
 */
/* const deleteRole = async (roleId) => {
    try {
        const deleted = await PermissionRoles.findByIdAndDelete(roleId)
        if (!deleted) {
            throw new Error(errorMsg.roleNotFound)
        }
        await updateAccessControl()
        return deleted
    } catch (error) {
        // Add error message to be sent
        throw new Error(error.message)
    }
} */

export default {
    ac,
    check,
    initAccessControl,
    createRole,
    //deleteRole,
    updateRole,
    //updateAccessControl
}
