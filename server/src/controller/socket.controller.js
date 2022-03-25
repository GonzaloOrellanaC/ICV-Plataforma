import socketIo from 'socket.io'
import {NotificationService} from '../services';

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
    })
}