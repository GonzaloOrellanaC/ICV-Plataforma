import { Router } from 'express';
import { PdfMakerServices } from '../services';

const router = new Router()

router.post('/createPdf', PdfMakerServices.createPdf);


export default router