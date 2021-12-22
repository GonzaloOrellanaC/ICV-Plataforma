import axios from 'axios';

export default {
    getMachines: () => {
        //return axios.get('/icv/fileMachines')
        return axios.get('/machines/getMachinesOfProject')
    },
    getAllMachines: () => {
        return axios.get('/machines/readAllMachines')
    },
    getAllMachinesByModel: (idobra, model) => {
        const requestBody = {
            idobra: idobra,
            model: model
        }
        return axios.post('/machines/getAllMachinesByModel', requestBody)
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
