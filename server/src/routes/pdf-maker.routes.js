import { Router } from 'express';
import { PdfMakerServices } from '../services';

const router = new Router()

router.post('/createPdf', PdfMakerServices.createPdf);
router.post('/createPdfDoc', PdfMakerServices.createPdfDoc);


export default router