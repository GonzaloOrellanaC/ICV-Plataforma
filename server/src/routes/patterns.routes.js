import { Router } from 'express';
import { PatternsServices} from '../services'

const router = new Router()

router.get('/getPatterns', PatternsServices.getPatterns)
router.post('/savePattern', PatternsServices.savePattern)


router.get('/getPatternDetails', PatternsServices.getPatternDetails)

router.post('/getPatternsDetailByIdpm', PatternsServices.getPatternsDetailByIdpm)

export default router