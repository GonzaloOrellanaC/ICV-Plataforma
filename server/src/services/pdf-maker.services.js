import pdfMake from 'pdfmake';
import path from 'path';
import fs from 'fs';

const createPdf = (req, res) => {
    const { pdfContent } = req.body;
    console.log(pdfContent)

    createPdfBinary(pdfContent, (binary) => {
        res.contentType('application/pdf');
		res.send(binary);
	    }, (error) => {
		res.send('ERROR:' + error);
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
    };

    const doc = new pdfMake(fonts);
    const pdf = doc.createPdfKitDocument(pdfContent);

    //console.log(pdf)
    
    var chunks = [];
	var result;

	pdf.on('data', (chunk) => {
        //console.log(chunk)
		chunks.push(chunk);
	});
	pdf.on('end', () => {
		result = Buffer.concat(chunks);
        //console.log(result)
        callback('data:application/pdf;base64,' + result.toString('base64'));
	});
	pdf.end();
}

export default {
    createPdf
}