import axios from "axios"

const getSiteById = (_id) => {
    return axios.post('/sites/getSiteById', {_id: _id})
}
const getSites = () => {
    return axios.get('/sites/getSites')
}

export default {
    getSiteById,
    getSites
}