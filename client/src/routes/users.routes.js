import axios from 'axios'

export default {
    createUser: (userData, password) => {
        const requestBody = {
            userData,
            password
        }
        return axios.post('/users/createUser', requestBody)
    },
    editUser: (userData) => {
        const requestBody = {
            userData
        }
        return axios.post('/users/editUser', requestBody)
    },
    getAllUsers: () => {
        return axios.get('/users/getUsers')
    },
    getUser: (id) => {
        const requestBody = {
            id
        }
        return axios.post('/users/getUser', requestBody)
    },
    removeUser: (id) => {
        const requestBody = {
            id
        }
        return axios.post('/users/deleteUser', requestBody)
    }
}