import socketIo from 'socket.io'
import { Machine, Reports, Users } from '../models';
import { NotificationService, UserServices } from '../services';
import { Sentry } from '../services/sentry.services';
import toPDF from '../pdf/toPDF';

export default async (server) => {
    const user = Users
    console.log('Socket connection')
    const io = new socketIo.Server(server, {
        cors: {
            origin: '*',
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: false
        },
    })
    
    io.on('connection', (socket) => {
        socket.on('isConnected', async (data) => {
            const userData = await user.findById(data.id)
            Sentry.captureMessage(`${userData.name} ${userData.lastName} a iniciado sesión. ${data.frontVersion ? data.frontVersion : 'No informado'}`, 'info')
        })
        socket.on('test_user', (data) => {
            console.log('Get data......', data)
            io.emit(`test_${data.id}`, {message: data.message})
        })
        socket.on('termino-jornada', async (data) => {
            console.log('termino-jornada-log......', data)
            const sapExecutives = await UserServices.getUserByRoleAndSite('sapExecutive', data.idObra)
            const shiftManagers = await UserServices.getUserByRoleAndSite('shiftManager', data.idObra)
            const all = sapExecutives.concat(shiftManagers)
            all.forEach((user) => {
                console.log(user._id)
                io.emit(`notification_${user._id}`, {title: data.title, subtitle: data.title, message: data.message})
                NotificationService.createNotification(data)
            })
        })
        socket.on('nueva-asignacion', async (data) => {
            const response = await Reports.findById(data.reportId)
            const machineData = await Machine.findOne({equid: response.machine})
            if (machineData) {
                const newReport = {
                    _id: response._id,
                    level: response.level,
                    createdAt: response.createdAt,
                    createdBy: response.createdBy,
                    datePrev: response.datePrev,
                    deleted: response.deleted,
                    enabled: response.enabled,
                    endPrev: response.endPrev,
                    guide: response.guide,
                    history: response.history,
                    idIndex: response.idIndex,
                    idPm: response.idPm,
                    machine: response.machine,
                    reportType: response.reportType,
                    sapId: response.sapId,
                    site: response.site,
                    state: response.state,
                    testMode: response.testMode,
                    updatedAt: response.updatedAt,
                    updatedBy: response.updatedBy,
                    usersAssigned: response.usersAssigned,
                    machineData: machineData,
                    urlPdf:response.urlPdf,
                    sapExecutiveApprovedBy:response.sapExecutiveApprovedBy,
                    dateClose:response.dateClose,
                    chiefMachineryApprovedDate:response.chiefMachineryApprovedDate,
                    chiefMachineryApprovedBy:response.chiefMachineryApprovedBy,
                    shiftManagerApprovedDate:response.shiftManagerApprovedDate,
                    shiftManagerApprovedBy:response.shiftManagerApprovedBy,
                    endReport: response.endReport,
                    dateInit: response.dateInit
                }
                io.emit(`notification_${data.id}`, {title: data.title, subtitle: data.title, message: data.message, report: newReport})
                NotificationService.createNotification(data)
            }
        })
        socket.on('nuevo-reporte', async (data) => {
            io.emit(`nuevo_reporte_${data.id}`, {title: data.title, subtitle: data.title, message: data.message})
            /* NotificationService.createNotification(data) */
        })
        socket.on('retiro-asignacion', (data) => {
            console.log('Get data......', data)
            io.emit(`notification_${data.id}`, {title: data.title, subtitle: data.title, message: data.message})
            NotificationService.createNotification(data)
        })
        socket.on('termino-orden-1', async (data) => {
            const admins = await UserServices.getUserByRole('admin')
            const sapExecutives = await UserServices.getUserByRoleAndSite('sapExecutive', data.idObra)
            const shiftManagers = await UserServices.getUserByRoleAndSite('shiftManager', data.idObra)
            const chiefMachineries = await UserServices.getUserByRoleAndSite('chiefMachinery', data.idObra)
            const all = admins.concat(sapExecutives.concat(shiftManagers.concat(chiefMachineries)))
            all.forEach((user) => {
                console.log('Se crea notificación a '+user._id+' nombre: '+user.name+' '+user.lastName)
                let notificationToSave = {
                    id: user._id.toString(),
                    from: data.from,
                    url: data.url,
                    title: data.title, 
                    subtitle: data.title, 
                    message: data.message
                }
                io.emit(`notification_${user._id}`, {title: data.title, subtitle: data.title, message: data.message})
                NotificationService.createNotification(notificationToSave)
            })
        })
        socket.on('termino-orden-2', async (data) => {
            const admins = await UserServices.getUserByRole('admin')
            const sapExecutives = await UserServices.getUserByRoleAndSite('sapExecutive', data.idObra)
            const chiefMachineries = await UserServices.getUserByRoleAndSite('chiefMachinery', data.idObra)
            const all = admins.concat(sapExecutives.concat(chiefMachineries))
            all.forEach((user) => {
                console.log('Se crea notificación a '+user._id+' nombre: '+user.name+' '+user.lastName)
                let notificationToSave = {
                    id: user._id.toString(),
                    from: data.from,
                    url: data.url,
                    title: data.title, 
                    subtitle: data.title, 
                    message: data.message
                }
                io.emit(`notification_${user._id}`, {title: data.title, subtitle: data.title, message: data.message})
                NotificationService.createNotification(notificationToSave)
            })
        })
        socket.on('termino-orden-3', async (data) => {
            const admins = await UserServices.getUserByRole('admin')
            const sapExecutives = await UserServices.getUserByRoleAndSite('sapExecutive', data.idObra)
            const all = admins.concat(sapExecutives)
            all.forEach((user) => {
                console.log('Se crea notificación a '+user._id+' nombre: '+user.name+' '+user.lastName)
                let notificationToSave = {
                    id: user._id.toString(),
                    from: data.from,
                    url: data.url,
                    title: data.title, 
                    subtitle: data.title, 
                    message: data.message
                }
                io.emit(`notification_${user._id}`, {title: data.title, subtitle: data.title, message: data.message})
                NotificationService.createNotification(notificationToSave)
            })
        })
        socket.on('termino-orden-4', async (data) => {
            const admins = await UserServices.getUserByRole('admin')
            const sapExecutives = await UserServices.getUserByRoleAndSite('sapExecutive', data.idObra)
            const all = admins.concat(sapExecutives)
            all.forEach((user) => {
                console.log('Se crea notificación a '+user._id+' nombre: '+user.name+' '+user.lastName)
                let notificationToSave = {
                    id: user._id.toString(),
                    from: data.from,
                    url: data.url,
                    title: data.title, 
                    subtitle: data.title, 
                    message: data.message
                }
                io.emit(`notification_${user._id}`, {title: data.title, subtitle: data.title, message: data.message})
                NotificationService.createNotification(notificationToSave)
            })
        })
        socket.on('rechazo-orden-0', async (data) => {
            console.log(data)
            const admins = await UserServices.getUserByRole('admin')
            const sapExecutives = await UserServices.getUserByRoleAndSite('sapExecutive', data.idObra)
            const shiftManagers = await UserServices.getUserByRoleAndSite('shiftManager', data.idObra)
            const chiefMachineries = await UserServices.getUserByRoleAndSite('chiefMachinery', data.idObra)
            const userOperator = await UserServices.getUser(data.uid)
            const all = admins.concat(sapExecutives.concat(shiftManagers.concat(chiefMachineries.concat(userOperator))))
            all.forEach((user) => {
                console.log('Se crea notificación a '+user._id)
                let notificationToSave = {
                    id: user._id.toString(),
                    from: data.from,
                    url: data.url,
                    title: data.title, 
                    subtitle: data.title, 
                    message: data.message,
                    historyData: {
                        userId: data.uid,
                        dataType: 'rechazo'
                    }
                }
                console.log(`notification_${user._id}`)
                io.emit(`notification_${user._id}`, {title: data.title, subtitle: data.title, message: data.message})
                NotificationService.createNotification(notificationToSave)
            })
        })
        socket.on('rechazo-orden-1', async (data) => {
            console.log(data)
            const admins = await UserServices.getUserByRole('admin')
            const sapExecutives = await UserServices.getUserByRoleAndSite('sapExecutive', data.idObra)
            const shiftManagers = await UserServices.getUserByRoleAndSite('shiftManager', data.idObra)
            const chiefMachineries = await UserServices.getUserByRoleAndSite('chiefMachinery', data.idObra)
            const all = admins.concat(sapExecutives.concat(shiftManagers.concat(chiefMachineries/* .concat(userOperator) */)))
            all.forEach((user) => {
                console.log('Se crea notificación a '+user._id)
                let notificationToSave = {
                    id: user._id.toString(),
                    from: data.from,
                    url: data.url,
                    title: data.title, 
                    subtitle: data.title, 
                    message: data.message,
                    historyData: {
                        userId: data.uid,
                        dataType: 'rechazo'
                    }
                }
                console.log(`notification_${user._id}`)
                io.emit(`notification_${user._id}`, {title: data.title, subtitle: data.title, message: data.message})
                NotificationService.createNotification(notificationToSave)
            })
        })
        socket.on('rechazo-orden-2', async (data) => {
            console.log(data)
            const admins = await UserServices.getUserByRole('admin')
            const sapExecutives = await UserServices.getUserByRoleAndSite('sapExecutive', data.idObra)
            const shiftManagers = await UserServices.getUserByRoleAndSite('shiftManager', data.idObra)
            const chiefMachineries = await UserServices.getUserByRoleAndSite('chiefMachinery', data.idObra)
            const all = admins.concat(sapExecutives.concat(shiftManagers.concat(chiefMachineries.concat(userOperator))))
            all.forEach((user) => {
                console.log('Se crea notificación a '+user._id)
                let notificationToSave = {
                    id: user._id.toString(),
                    from: data.from,
                    url: data.url,
                    title: data.title, 
                    subtitle: data.title, 
                    message: data.message,
                    historyData: {
                        userId: data.uid,
                        dataType: 'rechazo'
                    }
                }
                console.log(`notification_${user._id}`)
                io.emit(`notification_${user._id}`, {title: data.title, subtitle: data.title, message: data.message})
                NotificationService.createNotification(notificationToSave)
            })
        })
        socket.on('toPDF', async (data) => {
            const reportData = data.report
            const user = data.user
            const responsePDF = await toPDF(reportData)
            let notificationToSave = {
                id: user._id.toString(),
                urlPDF: responsePDF.url,
                title: `OT${reportData.indexId} PDF`,
                subtitle: 'Ya puede descargar el documento.',
                message: 'Documento PDF generado'
            }
            io.emit(`notification_${user._id}`, {title: notificationToSave.title, subtitle: notificationToSave.subtitle, message: notificationToSave.message})
            NotificationService.createNotification(notificationToSave)
        })
        socket.on('test', async (data) => {
            const admins = await UserServices.getUserByRole('admin')
            const sapExecutives = await UserServices.getUserByRole('sapExecutive')
            const shiftManagers = await UserServices.getUserByRole('shiftManager')
            const chiefMachineries = await UserServices.getUserByRole('chiefMachinery')
            const inspectionWorkers = await UserServices.getUserByRole('inspectionWorker')
            const maintenceOperators = await UserServices.getUserByRole('maintenceOperator')
            const all = admins.concat(
                            sapExecutives.concat(
                                shiftManagers.concat(
                                    chiefMachineries.concat(
                                        inspectionWorkers.concat(
                                            maintenceOperators
                                        )
                                    )
                                )
                            )
                        )
            all.map((user) => {
                console.log('Se crea notificación a '+user._id)
                let notificationToSave = {
                    id: user._id.toString(),
                    from: data.from,
                    url: data.url,
                    title: data.title, 
                    subtitle: data.title, 
                    message: data.message
                }
                io.emit(`notification_${user._id}`, {title: data.title, subtitle: data.title, message: data.message})
                NotificationService.createNotification(notificationToSave)
            })
        })
    })

    
}