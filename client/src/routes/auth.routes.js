import axios from 'axios'

export default {
    login: (email, password) => {
        const requestBody = {
            user: {
                email,
                password
            }
        }

        return axios.post('/auth/login', requestBody)
    },
    register: (userData, password) => {
        const requestBody = {
            userData,
            password
        }

        return axios.post('/auth/register', requestBody)
    },
    forgotPassword: (email) => {
        const requestBody = {
            email
        }

        return axios.post('/auth/forgotpassword', requestBody)
    },
    logout: (userData) => {
        const requestBody = {
            userData
        }

        return axios.post('/auth/logout', requestBody)
    }
}
