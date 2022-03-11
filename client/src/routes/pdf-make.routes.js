import axios from 'axios'

export default {
    createPdf: (pdfContent) => {
        const requestBody = {
            pdfContent
        }
        console.log(requestBody)
        return axios.post('/pdf-maker/createPdf', requestBody)
    }
}