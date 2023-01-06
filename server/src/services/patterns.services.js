import { Patterns } from '../models'


const getPatterns = async (req, res) => {
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

export default {
    getPatterns,
    savePattern
}