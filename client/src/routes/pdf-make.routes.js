import axios from 'axios'

export default {
    createPdf: (pdfContent, nroOT) => {
        const requestBody = {
            pdfContent,
            nroOT
        }
        return axios.post('/pdf-maker/createPdf', requestBody)
    }
}