import axios from 'axios'

export default {
    getRoles: () => {
        return axios.get('/roles/getRoles')
    }
}