import axios from 'axios'

export default {
    getNotificationsById: (_id) => {
        const requestBody = {
            id: _id
        }
        return axios.post('/notifications/getNotificationsById', requestBody)
    },
    actualiceNotificationState: (_id) => {
        const requestBody = {
            _id: _id,
            state: true
        }
        return axios.post('/notifications/actualiceNotificationState', requestBody)
    }
}