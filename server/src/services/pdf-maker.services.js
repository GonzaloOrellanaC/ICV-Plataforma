import pdfMake from 'pdfmake'
import path from 'path'
import { AzureServices } from './'

const createPdf = (req, res) => {
    console.log('Iniciando descarga de pdf')
    const { pdfContent, nroOT } = req.body

    if(pdfContent) {
        console.log(pdfContent)
        console.log('Contenido descargado')
    }

    createPdfBinary(pdfContent, (binary) => {
        console.log('Enviando...')
        /* AzureServices.uploadPdfFile(binary, nroOT) */
        res.contentType('application/pdf')
		res.send(binary)
	    }, (error) => {
		res.send('ERROR:' + error)
    }, (error) => {
        res.send('Error' + error)
    })
    

}

const createPdfBinary = ( pdfContent, callback ) => {
    var fonts = {
        Roboto: {
            normal: path.resolve(__dirname, "../fonts/Roboto-Regular.ttf"),
            bold: path.resolve(__dirname, "../fonts/Roboto-Medium.ttf"),
            italics: path.resolve(__dirname, "../fonts/Roboto-Italic.ttf"),
            bolditalics: path.resolve(__dirname, "../fonts/Roboto-MediumItalic.ttf"),
        }
    }
    /* console.log(fonts) */
    const doc = new pdfMake(fonts)
    const pdf = doc.createPdfKitDocument(pdfContent)
    /* console.log(pdf) */
    var chunks = []
	var result
	pdf.on('data', (chunk) => {
        //console.log(chunk)
		chunks.push(chunk)
	})
	pdf.on('end', () => {
		result = Buffer.concat(chunks)
        console.log('PDF Listo')
        callback('data:application/pdf;base64,' + result.toString('base64'))
	})
	pdf.end()
}

export default {
    createPdf
}