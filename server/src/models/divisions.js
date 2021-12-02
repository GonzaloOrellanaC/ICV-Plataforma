/* Mongoose */
import { model, Schema } from 'mongoose'

/* Division Schema */
const DivisionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    site: {
        type: Schema.Types.ObjectId,
        ref: 'Site'
    },
    users: {
        type: Array,
        default: []
    }
},
{
    timestamps: true
}
)

const Division = model('Division', DivisionSchema)

export default Division
