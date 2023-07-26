import axios from "axios"

const createNewText = (news) => {
    return axios.post('/news/createNewsText', {news: news})
}

const createNewWithImage = (news) => {
    return axios.post('/news/createNewWithImage', {news: news})
}

const createNewWithVideo = (news) => {
    return axios.post('/news/createNewWithVideo', {news: news})
}

const getMyNews = (userId) => {
    return axios.post('/news/getMyNews', {userId: userId})
}

export default {
    createNewText,
    createNewWithImage,
    createNewWithVideo,
    getMyNews
}