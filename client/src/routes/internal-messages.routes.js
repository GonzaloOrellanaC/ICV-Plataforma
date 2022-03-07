import axios from 'axios';

export default {
    getMessagesByUser: (_id) => {
        const requestBody = {
            _id
        }
        return axios.post('/internalMessagesData/get-messages-by-user', requestBody)
    },
    getAllMessages: () => {
        return axios.get('/internalMessagesData/getAllMessages')
    },
    sendMessage: (message) => {
        const requestBody = {
            message
        }
        return axios.post('/internalMessagesData/sendMessage', requestBody)
    },
    removeMessage: (_id) => {
        const requestBody = {
            _id
        }
        return axios.post('/internalMessagesData/removeMessage', requestBody)
    }
}