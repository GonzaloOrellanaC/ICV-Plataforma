import { AccessControl } from 'accesscontrol'
import { UserServices } from '.'
import { environment } from '../config'
import { Permission,Roles, Site, Machine, Users, Reports, ExecutionReport, Cron } from '../models';
import { ApiIcv } from '../api-icv';
import apiIcvConnection from '../api-icv/api-icv.connection';
import { CronJob } from 'cron'
import { isValidObjectId } from 'mongoose';
import userServices from './user.services';
//import { apiIcvLoader } from '../loaders'

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

        /* LIMPIADOR DE DATOS DE EJECUCIÓN */
        /* const responseData = await ExecutionReport.find({reportId: '63bedd7a9755fd0086c74717'})
        if (responseData.length > 0) {
            console.log('**********************************************BORRANDO')
            responseData.forEach(async (res, index) => {
                await ExecutionReport.findByIdAndDelete(res._id)
            })
        }
        console.log('**********************************************', responseData.length) */
        const users = await Users.find({})
        users.forEach(async (user, index) => {
            /* user.isTest = false */
            if (user.roles && user.roles.length > 0) {

            } else {
                const roles = [user.role]
                user.roles = roles
                await Users.findByIdAndUpdate(user._id, user)
                console.log(user.name + ' ' + user.lastName, ' added role')
            }
            if(user.sites) {
                /* console.log((JSON.parse(user.sites)).idobra) */
                if ((JSON.parse(user.sites)).idobra === '0369') {
                    user.obras = ['641c8e48c58d0f4c9485debb']
                    await Users.findByIdAndUpdate(user._id, user)
                } else if ((JSON.parse(user.sites)).idobra === '0370') {
                    user.obras = ['641c8e48c58d0f4c9485debd']
                    await Users.findByIdAndUpdate(user._id, user)
                } else {
                    user.obras = [(JSON.parse(user.sites))._id]
                    await Users.findByIdAndUpdate(user._id, user)
                }
            } else {
                /* await Users.findByIdAndUpdate(user._id, user) */
            }
        })
        const findRoles = await Roles.find({})
        const adminResult = await getAdminExist();
        const findSites = await getSites();
        await ApiIcv.createSiteToSend();
        findSites.forEach(async (site, index) => {
            try {
                await ApiIcv.createMachinesToSend(site.idobra, false)
            } catch (error) {
                console.log(error)
            }
        })
        if(adminResult.length === 0) {
            createAdminDefault();
        } else {
            console.log('No se crea admin')
        }

        /* const reports = await Reports.find({})
        const elements = reports.slice(0, 100)
        console.log('listado tiene ', elements.length, ' elementos')
        elements.forEach(async (report, i) => {
            await ExecutionReport.findByIdAndDelete({reportId: report._id})
            if (i === (elements.length - 1)) {
                console.log('Ejecuciones eliminadas')
            }
        })

        elements.forEach(async (report, i) => {
            await Reports.findByIdAndDelete(report._id)
            if (i === (elements.length - 1)) {
                console.log('Reportes eliminadas')
            }
        }) */
        /* reports.forEach(async (report, i) => {
            const response = await ExecutionReport.find({reportId: report._id})
            if (response.length > 1) {
                const ordered = await response.sort((a, b) => {
                    return new Date(b.updatedAt) - new Date(a.updatedAt)
                })
                console.log(ordered[0]._id, ordered[0].reportId, ordered[0].updatedAt)
                ordered.forEach(async (el, n) => {
                    if (n === 0) {

                    } else {
                        await ExecutionReport.findByIdAndDelete(el._id)
                    }
                })
            }
        }) */
        /* const executionReports = await ExecutionReport.find()
        executionReports.forEach(async (el, i) => {
            const response = await Reports.findById(el.reportId)
            if (!response) {
                console.log(el._id)
                try {
                    await ExecutionReport.findByIdAndDelete(el._id)
                } catch (error) {
                    console.log(error)
                }
            }
        }) */
        /* 

        elements.forEach(async (report, i) => {
            await ExecutionReport.findByIdAndDelete({reportId: report._id})
            if (i === (elements.length - 1)) {
                console.log('Ejecuciones eliminadas')
            }
        })

        elements.forEach(async (report, i) => {
            await Reports.findByIdAndDelete(report._id)
            if (i === (elements.length - 1)) {
                console.log('Reportes eliminadas')
            }
        }) */

       /*  const executionReports = await ExecutionReport.find()
        executionReports.forEach(async (ex, i) => {
            const execution = ex
            execution.report = ex.reportId
            execution.reportId = null
            const executionCache = execution
            await ExecutionReport.findByIdAndUpdate(executionCache._id, executionCache)

        }) */
        /* reports.forEach(async (report, index) => { */
            /* const rep = report */
            /* await Reports.findByIdAndUpdate(report._id, report) */
            /* rep.createdBy = report.createdBy
            rep.updatedAt = report.updatedAt
            rep.shiftManagerApprovedBy = report.shiftManagerApprovedBy
            rep.chiefMachineryApprovedBy = report.chiefMachineryApprovedBy
            rep.sapExecutiveApprovedBy = report.sapExecutiveApprovedBy
            rep.userAsigned = report.userAsigned */
            /* if (report.site === '0369') {
                await Reports.findByIdAndUpdate(report._id, {site: '0380'})
            } else if (report.site === '0370') {
                await Reports.findByIdAndUpdate(report._id, {site: '0383'})
            } */
            /* await Reports.findByIdAndUpdate(report._id, report) */
        /* }) */
        if (!findRoles) {
            environment.roles.forEach(async (role, index) => {
                let roleCreated = await createRole(role.name, role.dbName);
                if(roleCreated) {
                    let result = `${role.name} created`;
                    /* console.log(result) */
                }
                if(index == (environment.roles.length - 1)) {
                    environment.permisos.forEach(async (permiso, i) => {
                        let permissionCreated = await createPermission(permiso.name, permiso.resources);
                        if(permissionCreated) {
                            let result2 = `${permiso.name} created`;
                        }
                        if(i == (environment.permisos.length - 1)) {
                            
                        }
                    })
                }
            })
        } else if (findRoles.length < environment.roles.length) {
            findRoles.forEach(async (r, i) => {
                await deleteRole(r._id)
                if(i == (findRoles.length - 1)) {
                    environment.roles.forEach(async (role, index) => {
                        let roleCreated = await createRole(role.name, role.dbName);
                        if(roleCreated) {
                            let result = `${role.name} created`;
                            /* console.log(result) */
                        }
                    })
                }
            })
        }
        /* 
            CADA 12 HRS SE ACTUALIZA DATA DE MÁQUINAS Y SITIOS
        */
        /* setInterval(async () => {
            const findMachines = await Machine.find();
            if(findMachines) {
                if(findMachines.length > 0) {
                    findSites.forEach(({idobra}, index) => {
                        ApiIcv.editMachineToSend(idobra)
                    })
                }
            }
            await ApiIcv.createSiteToSend();
            findSites.forEach(async (site, index) => {
                try {
                    await ApiIcv.createMachinesToSend(site.idobra, false)
                } catch (error) {
                    console.log(error)
                }
            })
        }, (86400000 / 2)); */

        // const jobPautas = new CronJob('*/15 * * * *', () => {
        //     console.log('Starting CRON Job')
        //     apiIcvConnection.leerPautas2()
        // })
        // jobPautas.start()

        
        initTimeMachinesCron()
        /* 
            CADA 15 MINUTOS SE ACTUALIZA DATA PAUTAS
        */
       
        /* apiIcvConnection.leerPautas2()
        setInterval(() => {
            
        }, (60000*15)) */
        
    } catch (error) {
        console.error(error)
    }
}

let machinesCronState

const machinesCron = (time) => {
    const jobMachines = new CronJob(time, async () => {
        const findSites = await getSites();
        console.log('Starting CRON Job')
        const findMachines = await Machine.find();
        if(findMachines) {
            if(findMachines.length > 0) {
                findSites.forEach(({idobra}, index) => {
                    ApiIcv.editMachineToSend(idobra)
                })
            }
        }
        await ApiIcv.createSiteToSend();
        findSites.forEach(async (site, index) => {
            try {
                await ApiIcv.createMachinesToSend(site.idobra, false)
            } catch (error) {
                console.log(error)
            }
        })
    })
    return jobMachines
}


const initTimeMachinesCron = async () => {
    const times = await Cron.find()
    console.log(times)
    machinesCronState = machinesCron(times[0].timeMachines)
    machinesCronState.start()
}

const stopTimeMachinesCron = () => {
    machinesCronState.stop()
}

const createAdminDefault = async () => {
    try {
        let newUser = await UserServices.createUser(environment.adminDefaultData, environment.adminDefaultData.password);
        if(newUser) {
        }
    } catch(error) {
    }
}

const getAdminExist = () => {
    try{
        return new Promise(async resolve => {
            let adminExist = await UserServices.getUserByRole('superAdmin');
            resolve(adminExist);
        })
    } catch (err) {
    }
}

const getSites = () => {
    try{
        return new Promise(resolve => {
            Site.find({}, (err, sites) => {
                resolve(sites)
            });
            
        })
    } catch (err) {
    }
}

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
const deleteRole = async (roleId) => {
    try {
        const deleted = await Roles.findByIdAndDelete(roleId)
        if (!deleted) {
            throw new Error(errorMsg.roleNotFound)
        }
        return deleted
    } catch (error) {
        throw new Error(error.message)
    }
    /* try {
        const deleted = await PermissionRoles.findByIdAndDelete(roleId)
        if (!deleted) {
            throw new Error(errorMsg.roleNotFound)
        }
        await updateAccessControl()
        return deleted
    } catch (error) {
        // Add error message to be sent
        throw new Error(error.message)
    } */
} 

export default {
    ac,
    check,
    initAccessControl,
    createRole,
    deleteRole,
    updateRole,
    initTimeMachinesCron,
    stopTimeMachinesCron
}
