import { Notification } from '../models'

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
    console.log(notificationData)
    return new Promise(resolve => {
        const notification = new Notification(notificationData);
        notification.save()
    })
}

const getNotificationsById = (req, res) => {
    const { id } = req.body
    console.log(id)
    Notification.find({userId: id}, (err, docs) => {
        if(err) {
            res.send({err: err})
        }
        res.send(docs)
    })
}

const actualiceNotificationState = (req, res) => {
    const { _id, state } = req.body
    console.log(id)
    Notification.findByIdAndUpdate(_id, {state: state}, { new: true })
}

export default {
    createNotification,
    getNotificationsById,
    actualiceNotificationState
}