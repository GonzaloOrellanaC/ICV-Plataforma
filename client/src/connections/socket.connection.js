import { io } from "socket.io-client";

const socket = io()

const sendnotificationToUser = (notificationType, from, userId, title, subtitle, message, url) => {
    socket.emit(notificationType, {title: title, from: from, subtitle: subtitle, message: message, id: userId, url: url})
}

const sendnotificationToManyUsers = (notificationType, from, title, subtitle, message, url) => {
    socket.emit(notificationType, {title: title, from: from, subtitle: subtitle, message: message, url: url})
}

export default {
    sendnotificationToUser,
    sendnotificationToManyUsers
}