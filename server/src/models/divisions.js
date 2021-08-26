/* Mongoose */
import { model, Schema } from 'mongoose'

/* Division Schema */
const DivisionsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
)

const Divisions = model('Division', DivisionsSchema)

export default Divisions
