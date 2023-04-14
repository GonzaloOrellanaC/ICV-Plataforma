import axios from "axios"

const getSiteById = (_id) => {
    return axios.post('/sites/getSiteById', {_id: _id})
}

export default {
    getSiteById
}