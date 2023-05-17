import axios from 'axios'

export default {
    createUser: (userData, password) => {
        const requestBody = {
            userData,
            password
        }
        return axios.post('/users/createUser', requestBody)
    },
    editUser: (userData, id) => {
        const requestBody = {
            userData,
            id
        }
        return axios.post('/users/editUser', requestBody)
    },
    getAllUsers: (admin, isTest) => {
        return axios.post('/users/getUsers', {admin: admin, isTest: isTest})
    },
    getMantenedores: (admin) => {
        return axios.post('/users/getMantenedores', {admin: admin})
    },
    getOperadores: (admin) => {
        return axios.post('/users/getOperadores', {admin: admin})
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
    },
    findByRut: (rut) => {
        const requestBody = {
            rut
        }
        return axios.post('/users/findByRut', requestBody)
    },
    findByRole: (role) => {
        const requestBody = {
            role
        }
        return axios.post('/users/findByRole', requestBody)
    },
    getUserSign: (id) => {
        const requestBody = {
            id
        }
        return axios.post('/users/getUserSign', requestBody)
    }
}