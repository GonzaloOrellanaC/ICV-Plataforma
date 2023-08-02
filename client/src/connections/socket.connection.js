import { io } from "socket.io-client";
import environment from "../config/environment.config";

const socket = io()

/* const toPDF = (report, user) => {
    const data = {
        report,
        user
    }
    socket.emit('toPDF', data)
} */

const listenNotifocations = (userData, notificationData) => {
    socket.on(`notification_${userData._id}`, data => {
        console.log(data)
        notificationData(data)
    })
}

const listenReports = (userData, reportsData) => {
    socket.on(`nuevo_reporte_${userData._id}`, data => {
        reportsData(data)
        /* getNotifications() */
    })
}

const sendIsActive = (userData) => {
    console.log('Revisando')
    socket.emit('isConnected', {id: userData._id, frontVersion: environment.version})
}

const sendnotificationToUser = (notificationType, from, userId, title, subtitle, message, url, reportId) => {
    socket.emit(notificationType, {title: title, from: from, subtitle: subtitle, message: message, id: userId, url: url, reportId: reportId ? reportId : null})
}

const sendnotificationToManyUsers = (notificationType, from, title, subtitle, message, url, uid, idObra) => {
    socket.emit(notificationType, {title: title, from: from, subtitle: subtitle, message: message, url: url, uid: uid, idObra: idObra})
}

const sendnotificationToAllUsers = (notificationType, from, title, subtitle, message, url, idObra) => {
    socket.emit(notificationType, {title: title, from: from, subtitle: subtitle, message: message, url: url, idObra: idObra})
}

export default {
    /* toPDF, */
    listenNotifocations,
    listenReports,
    sendIsActive,
    sendnotificationToUser,
    sendnotificationToManyUsers,
    sendnotificationToAllUsers
}