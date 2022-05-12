import axios from 'axios';

export default {
    getMachines: () => {
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
    getMachineByEquid: (equid) => {
        const requestBody = {
            equid: equid,
        }
        return axios.post('/machines/readMachineByEquid', requestBody)
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
    getPautas: () => {
        return axios.get('icv/getPautas')
    },
    getHeaderPauta: ({idpm, typepm}) => {
        console.log(idpm, typepm)
        const requestBody = {
            idpm, typepm
        }
        return axios.post('icv/getHeaderPauta', requestBody)
    },
    getStructsPauta: ({idpm, typepm}) => {
        const requestBody = {
            idpm, typepm
        }
        console.log(requestBody)
        return axios.post('icv/getStructsPauta', requestBody)
    },
    getStructsPauta2: (idpm, typepm) => {
        const requestBody = {
            idpm, typepm
        }
        console.log(requestBody)
        return axios.post('/icv/getStructsPauta', requestBody)
    }
}
