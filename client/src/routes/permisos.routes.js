import axios from 'axios'

export default {
    getPermisos: () => {
        return axios.get('/permisos/getPermisos')
    },
    getPermisosByUser: (id) => {
        const requestBody = {
            id
        }
        return axios.post('/permisos/getPermisosByUser', requestBody)
    }
}