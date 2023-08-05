import { Notification } from '../models'
import { Sentry } from './sentry.services';

const createNotification = (data) => {
    let historyData;
    if(data.historyData){
        historyData = data.historyData
    }else{
        historyData = null
    }
    let notificationData = {
        userId: data.id,
        from: data.from,
        title: data.title,
        subtitle: data.subtitle,
        message: data.message,
        state: false,
        url: data.url,
        historyData: data.historyData
    }
    /* console.log(notificationData) */
    return new Promise(resolve => {
        const notification = new Notification(notificationData);
        notification.save()
    })
}

const getNotificationsById = (req, res) => {
    const { id } = req.body
    /* console.log(id) */
    Notification.find({userId: id}, (err, docs) => {
        if(err) {
            res.send({err: err})
            Sentry.captureException(err)
        }
        if (docs.length > 0) {
            res.send(docs.slice((docs.length - 2000), docs.length))
        } else {
            res.send([])
        }
    })
}

const actualiceNotificationState = async (req, res) => {
    const { _id, state } = req.body
    const notificaction = await Notification.findByIdAndUpdate(_id, {state: state})
    res.send(notificaction)
}

export default {
    createNotification,
    getNotificationsById,
    actualiceNotificationState
}