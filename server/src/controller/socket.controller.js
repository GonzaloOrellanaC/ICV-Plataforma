import socketIo from 'socket.io'
import {NotificationService, UserServices} from '../services';
import reportsService from '../services/reports.service';

export default async (server) => {
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
            console.log('Activado!!!', data)
            /* const responseData1 = await reportsService.readIfReportIsOneDayToStart()
            console.log(responseData1)
            const list = []
            responseData1.forEach(async (report, index) => {
                report.usersAssigned.forEach((user, i) => {
                    if(user === data.id) {
                        list.push(report)
                    }
                })
                if(index === (responseData1.length - 1)) {
                    console.log(list)
                    if (list.length > 0) {
                        let notificationToSave = {
                            id: data.id.toString(),
                            url: './assignment',
                            title: `Aviso de inicio próximo de OT.`, 
                            subtitle: `Debe ingresar próximamente.`, 
                            message: `Existen ${list.length} OT a punto de iniciar.`
                        }
                        io.emit(`notification_${data.id}`, {title: notificationToSave.title, subtitle: notificationToSave.subtitle, message: notificationToSave.message})
                        NotificationService.createNotification(notificationToSave)
                        const user = await UserServices.getUser(data.id.toString())
                        const admins = await UserServices.getUserByRole('admin')
                        const sapExecutives = await UserServices.getUserByRole('sapExecutive')
                        const shiftManagers = await UserServices.getUserByRole('shiftManager')
                        const chiefMachineries = await UserServices.getUserByRole('chiefMachinery')
                        const all = admins.concat(sapExecutives.concat(shiftManagers.concat(chiefMachineries)))
                        all.forEach((user) => {
                            console.log('Se crea notificación a '+user._id)
                            let notificationToSave = {
                                id: user._id.toString(),
                                url: './assignment',
                                title: `Aviso de inicio próximo de OT.`, 
                                subtitle: `Debe ingresar próximamente.`, 
                                message: `${user.name} ${user.lastName} tiene ${list.length} OT a punto de iniciar.`
                            }
                            console.log(`notification_${user._id}`)
                            io.emit(`notification_${user._id}`, {title: data.title, subtitle: data.subtitle, message: data.message})
                            NotificationService.createNotification(notificationToSave)
                        })
                    }
                }
                
            }) */
        })
        socket.on('test_user', (data) => {
            console.log('Get data......', data)
            io.emit(`test_${data.id}`, {message: data.message})
        })
        socket.on('termino-jornada', async (data) => {
            console.log('termino-jornada-log......', data)
            const sapExecutives = await UserServices.getUserByRole('sapExecutive')
            const shiftManagers = await UserServices.getUserByRole('shiftManager')
            const all = sapExecutives.concat(shiftManagers)
            all.forEach((user) => {
                console.log(user._id)
                io.emit(`notification_${user._id}`, {title: data.title, subtitle: data.title, message: data.message})
                NotificationService.createNotification(data)
            })
        })
        socket.on('nueva-asignacion', (data) => {
            console.log('Get data......', data)
            io.emit(`notification_${data.id}`, {title: data.title, subtitle: data.title, message: data.message})
            NotificationService.createNotification(data)
        })
        socket.on('retiro-asignacion', (data) => {
            console.log('Get data......', data)
            io.emit(`notification_${data.id}`, {title: data.title, subtitle: data.title, message: data.message})
            NotificationService.createNotification(data)
        })
        socket.on('termino-orden-1', async (data) => {
            const admins = await UserServices.getUserByRole('admin')
            const sapExecutives = await UserServices.getUserByRole('sapExecutive')
            const shiftManagers = await UserServices.getUserByRole('shiftManager')
            const chiefMachineries = await UserServices.getUserByRole('chiefMachinery')
            const all = admins.concat(sapExecutives.concat(shiftManagers.concat(chiefMachineries)))
            all.forEach((user) => {
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
        socket.on('termino-orden-2', async (data) => {
            const admins = await UserServices.getUserByRole('admin')
            const sapExecutives = await UserServices.getUserByRole('sapExecutive')
            const chiefMachineries = await UserServices.getUserByRole('chiefMachinery')
            const all = admins.concat(sapExecutives.concat(chiefMachineries))
            all.forEach((user) => {
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
        socket.on('termino-orden-3', async (data) => {
            const admins = await UserServices.getUserByRole('admin')
            const sapExecutives = await UserServices.getUserByRole('sapExecutive')
            const all = admins.concat(sapExecutives)
            all.forEach((user) => {
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
        socket.on('termino-orden-4', async (data) => {
            const admins = await UserServices.getUserByRole('admin')
            const sapExecutives = await UserServices.getUserByRole('sapExecutive')
            const all = admins.concat(sapExecutives)
            all.forEach((user) => {
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
        socket.on('rechazo-orden-0', async (data) => {
            console.log(data)
            const admins = await UserServices.getUserByRole('admin')
            const sapExecutives = await UserServices.getUserByRole('sapExecutive')
            const shiftManagers = await UserServices.getUserByRole('shiftManager')
            const chiefMachineries = await UserServices.getUserByRole('chiefMachinery')
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
            const sapExecutives = await UserServices.getUserByRole('sapExecutive')
            const shiftManagers = await UserServices.getUserByRole('shiftManager')
            const chiefMachineries = await UserServices.getUserByRole('chiefMachinery')
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
            const sapExecutives = await UserServices.getUserByRole('sapExecutive')
            const shiftManagers = await UserServices.getUserByRole('shiftManager')
            const chiefMachineries = await UserServices.getUserByRole('chiefMachinery')
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