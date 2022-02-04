/* Mongoose */
import { model, Schema } from 'mongoose'

/* Log Schema */
const LogSchema = new Schema({
    users: {
        type: Schema.Types.Array,
        default: []
    },
    description: {
        type: Schema.Types.String,
        required: true
    },
    type: {
        type: Schema.Types.String,
        required: true
    }
},
{
    timestamps: true
}
)

const Log = model('Log', LogSchema)

export default Log
