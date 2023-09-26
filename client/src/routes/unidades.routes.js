import axios from "axios"

const getUnidades = () => {
    return axios.get('/unidades/getUnidades')
}

export default {
    getUnidades
}