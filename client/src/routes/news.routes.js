import axios from "axios"

const createNewText = (news) => {
    return axios.post('/news/createNewsText', {news: news})
}

export default {
    createNewText
}