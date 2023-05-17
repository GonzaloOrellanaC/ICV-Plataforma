import { io } from "socket.io-client";
import environment from "../config/environment.config";

const socket = io()

const toPDF = (report, user) => {
    const data = {
        report,
        user
    }
    socket.emit('toPDF', data)
}

const listenNotifocations = (userData, notificationData) => {
    socket.on(`notification_${userData._id}`, data => {
        console.log(data)
        notificationData(data)
    })
}

const listenReports = (userData, reportsData) => {
    socket.on(`nuevo_reporte_${userData._id}`, data => {
        reportsData(data)
    })
}

const sendIsActive = (userData) => {
    console.log('Revisando')
    socket.emit('isConnected', {id: userData._id, frontVersion: environment.version})
}

const sendnotificationToUser = (notificationType, from, userId, title, subtitle, message, url) => {
    socket.emit(notificationType, {title: title, from: from, subtitle: subtitle, message: message, id: userId, url: url})
}

const sendnotificationToManyUsers = (notificationType, from, title, subtitle, message, url, uid) => {
    socket.emit(notificationType, {title: title, from: from, subtitle: subtitle, message: message, url: url, uid: uid})
}

const sendnotificationToAllUsers = (notificationType, from, title, subtitle, message, url) => {
    socket.emit(notificationType, {title: title, from: from, subtitle: subtitle, message: message, url: url})
}

export default {
    toPDF,
    listenNotifocations,
    listenReports,
    sendIsActive,
    sendnotificationToUser,
    sendnotificationToManyUsers,
    sendnotificationToAllUsers
}