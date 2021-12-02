import axios from 'axios';
import { Network } from '../connections';

export default {
    getMachines: () => {
        return axios.get('/icv/fileMachines')
    },
    getPMList: () => {
        return axios.get('/icv/petitionFiles')
    },
    getFiles: (fileName) => {
        const requestBody = {
            fileName: fileName
        }
        return axios.post('/icv/petitionFile', requestBody)
    },
    getSites: () => {
        return axios.get('icv/getSites')
    },
    getPMs: (fileName) => {
        const requestBody = {
            fileName: fileName
        }
        return axios.post('/data/readPMHeader', requestBody)
    },
    getFile: (fileName) => {
        const requestBody = {
            fileName: fileName
        }
        return axios.post('data/getFile', requestBody)
    }
}
