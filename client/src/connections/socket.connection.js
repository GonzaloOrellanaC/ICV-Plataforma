import { io } from "socket.io-client";
import environment from "../config/environment.config";

const socket = io()

const sendIsActive = () => {
    console.log('Revisando')
    socket.emit('isConnected', {id: localStorage.getItem('_id'), frontVersion: environment.version})
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
    sendIsActive,
    sendnotificationToUser,
    sendnotificationToManyUsers,
    sendnotificationToAllUsers
}