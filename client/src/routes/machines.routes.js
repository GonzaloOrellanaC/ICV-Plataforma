import axios from 'axios'

/* export default {
    getMachineByEquid: (equid) => {
        const requestBody = {
            equid,
        }
        return axios.post('/machines/readMachineByEquid', requestBody)
    }
} */

export const getMachineByEquid = async (equid) => {
    const response = await axios.post('/machines/readMachineByEquid', {equid: equid})
    return response
}

export const agregarTipoMaquina = async (tipo) => {
    const response = await axios.post('/machines/agregarTipoMaquina', {tipo:tipo})
    return response.data
}

export const agregarMarcaMaquina = async (marca) => {
    const response = await axios.post('/machines/agregarMarcaMaquina', {marca: marca})
    return response.data
}

export const agregarModeloMaquina = async (marcaId, modelo) => {
    const response = await axios.post('/machines/agregarModeloMaquina', {marcaId: marcaId, modelo: modelo})
    return response.data
}

export const obtenerTipoMaquinas = async () => {
    const response = await axios.get('/machines/obtenerTipoMaquinas')
    return response.data
}

export const obtenerMarcaMaquinas = async () => {
    const response = await axios.get('/machines/obtenerMarcaMaquinas')
    return response.data
}

export const obtenerModeloMaquinas = async () => {
    const response = await axios.get('/machines/obtenerModeloMaquinas')
    return response.data
}

export const createMachine = async (machine) => {
    const response = await axios.post('/machines/createMachine', {machine})
    return response.data
}


