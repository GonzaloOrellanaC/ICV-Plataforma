import axios from 'axios'

export default {
    createPdf: (pdfContent) => {
        const requestBody = {
            pdfContent
        }
        return axios.post('/pdf-maker/createPdf', requestBody)
    }
}