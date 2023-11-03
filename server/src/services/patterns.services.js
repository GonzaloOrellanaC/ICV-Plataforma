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
        /* console.log(pattern) */
        const newPattern = await Patterns.create(pattern)
        /* console.log(pattern) */
        res.json(newPattern)
    } catch (err) {

    }
}

const getPatternDetails = async (req, res) => {
    console.log('Leyendo Pautas totales...')
    try {
        const pautas = await PatternDetail.find()
        console.log(pautas.length)
        res.json(pautas)
        /* PatternDetail.find({}, (err, patterns) => {
            res.json(patterns)
        }); */
    } catch (err) {

    }
}

const getPatternsDetailByIdpm = async (req, res) => {
    console.log('Leyendo Pautas...')
    const {idpm} = req.body
    try {
        console.log(idpm)
        const response = await PatternDetail.find({idpm: idpm})
        res.status(200).send({data: response})
        /* PatternDetail.find({}, (err, patterns) => {
            res.json(patterns)
        }); */
    } catch (err) {
        console.log(err)
    }
}

export default {
    getPatterns,
    savePattern,
    getPatternDetails,
    getPatternsDetailByIdpm
}