import pdfMake from 'pdfmake'
import path from 'path'
import { AzureServices, ReportsService } from './'

const createPdf = (req, res) => {
    let resp = ''
    console.log('Iniciando descarga de pdf')
    const { pdfContent, nroOT } = req.body

    if(pdfContent) {
        console.log(pdfContent)
        console.log('Contenido descargado')
        resp+='PDF descargado'
    }

    createPdfBinary(pdfContent, resp, async (binary, resp) => {
        console.log('Enviando...')
        const state = await AzureServices.uploadPdfFile(binary, nroOT)
        console.log(state)
        /* res.contentType('application/pdf') */
        const data = await ReportsService.editReportByIndexIntern(nroOT, {urlPdf: state.data.url})
		if (data) {
            res.send({state: state, resp: resp})
        } else {
            res.send({
                data: 'Error', resp: resp
            })
        }
	    }, (error) => {
		res.send({error: 'Error: ' + error, resp: resp})
    }, (error) => {
        res.send({error: 'Error: ' + error, resp: resp})
    })
    

}

const createPdfBinary = ( pdfContent, resp, callback ) => {
    var fonts = {
        Roboto: {
            normal: path.resolve(__dirname, "../fonts/Roboto-Regular.ttf"),
            bold: path.resolve(__dirname, "../fonts/Roboto-Medium.ttf"),
            italics: path.resolve(__dirname, "../fonts/Roboto-Italic.ttf"),
            bolditalics: path.resolve(__dirname, "../fonts/Roboto-MediumItalic.ttf"),
        }
    }
    resp+='Fonts OK!'
    /* console.log(fonts) */
    const doc = new pdfMake(fonts)
    resp+='Doc OK!'
    const pdf = doc.createPdfKitDocument(pdfContent)
    if (pdf) {
        console.log('Ok')
        resp+='PDF OK!'
    }
    var chunks = []
	var result
	pdf.on('data', (chunk) => {
        //console.log(chunk)
		chunks.push(chunk)
	})
	pdf.on('end', () => {
		result = Buffer.concat(chunks)
        if(result) {
            console.log('Listo a guardar en Nube')
            resp+='Listo a guardar en Nube!'
        }
        console.log('PDF Listo')
        callback(result, resp/* 'data:application/pdf;base64,' + result.toString('base64') */)
	})
	pdf.end()
}

export default {
    createPdf
}