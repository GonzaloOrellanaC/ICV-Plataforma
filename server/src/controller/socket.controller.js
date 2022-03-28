import socketIo from 'socket.io'
import {NotificationService, UserServices} from '../services';

export default (server) => {
    console.log('Socket connection')
    const io = new socketIo.Server(server, {
        cors: {
            origin: '*',
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: false
        },
    });
    io.on('connection', (socket) => {
        socket.on('isConnected', (data) => {
            console.log('Activado!!!', data)
        });
        socket.on('test_user', (data) => {
            console.log('Get data......', data)
            io.emit(`test_${data.id}`, {message: data.message})
        })
        socket.on('termino-jornada', (data) => {
            console.log('Get data......', data)
            io.emit(`notification_${data.id}`, {title: data.title, subtitle: data.title, message: data.message})
            NotificationService.createNotification(data)
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
    })
}