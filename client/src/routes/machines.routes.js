import axios from 'axios'

export default {
    getMachineByEquid: (equid) => {
        const requestBody = {
            equid,
        }
        return axios.post('/machines/readMachineByEquid', requestBody)
    }
}