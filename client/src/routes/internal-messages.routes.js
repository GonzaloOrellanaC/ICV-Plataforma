import axios from 'axios';

export default {
    getMessagesByUser: (_id) => {
        const requestBody = {
            _id
        }
        return axios.post('/internal-messages/get-messages-by-user', requestBody)
    },
    sendMessage: (message) => {
        const requestBody = {
            message
        }
        return axios.post('/internal-messages/sendMessage', requestBody)
    },
    removeMessage: (_id) => {
        const requestBody = {
            _id
        }
        return axios.post('/internal-messages/removeMessage', requestBody)
    }
}