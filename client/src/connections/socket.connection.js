import { io } from "socket.io-client";

const socket = io()

const sendnotificationToUser = (notificationType, from, userId, title, subtitle, message, url) => {
    socket.emit(notificationType, {title: title, from: from, subtitle: subtitle, message: message, id: userId, url: url})
}

export default {
    sendnotificationToUser
}