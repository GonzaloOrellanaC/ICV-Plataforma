/* Mongoose */
import { model, Schema } from 'mongoose'

/* InternalMessage Schema */
const InternalMessageSchema = new Schema({
    from: {
        type: Schema.Types.String,
        required: true
    },
    to: {
        type: Schema.Types.String,
        required: true
    },
    description: {
        type: Schema.Types.String,
        required: true
    }
},
{
    timestamps: true
}
)

const InternalMessage = model('InternalMessage', InternalMessageSchema)

export default InternalMessage