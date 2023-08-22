import axios from 'axios'

export default {
    getPatterns: () => {
        return axios.get('/patterns/getPatterns')
    },
    savePattern: (pattern) => {
        return axios.post('/patterns/savePattern', pattern)
    },
    getPatternDetails: () => {
        return axios.get('/patterns/getPatternDetails')
    },
    getPatternsDetailByIdpm: (idpm) => {
        return axios.post('/patterns/getPatternsDetailByIdpm', {idpm: idpm})
    }
}