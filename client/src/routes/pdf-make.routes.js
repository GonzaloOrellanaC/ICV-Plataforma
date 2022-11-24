import axios from 'axios'

export default {
    createPdf: (pdfContent, nroOT, sapId, guide, numEquip) => {
        const requestBody = {
            pdfContent,
            nroOT,
            sapId,
            guide,
            numEquip
        }
        return axios.post('/pdf-maker/createPdf', requestBody)
    }
}