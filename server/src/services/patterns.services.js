import { PatternDetail, Patterns } from '../models'


const getPatterns = async (req, res) => {
    console.log('Leyendo Pautas...')
    try {
        Patterns.find({}, (err, patterns) => {
            res.json(patterns)
        });
    } catch (err) {

    }
}

const savePattern = async (req, res) => {
    try {
        const total = await Patterns.find()
        const pattern = req.body
        pattern.idPattern = total.length
        console.log(pattern)
        const newPattern = await Patterns.create(pattern)
        console.log(pattern)
        res.json(newPattern)
    } catch (err) {

    }
}

const getPatternDetails = async (req, res) => {
    console.log('Leyendo Pautas...')
    try {
        PatternDetail.find({}, (err, patterns) => {
            res.json(patterns)
        });
    } catch (err) {

    }
}

export default {
    getPatterns,
    savePattern,
    getPatternDetails
}