/* Mongoose */
import { model, Schema } from 'mongoose'

/* InternalMessage Schema */
const InternalMessageSchema = new Schema({
    from: {
        type: Schema.Types.String,
        required: true
    },
    subject: {
        type: Schema.Types.String,
        required: true
    },
    message: {
        type: Schema.Types.String,
        required: true
    },
    sendDate: {
        type: Schema.Types.Date,
        required: true
    },
    answer: {
        type: Schema.Types.String,
    },
},
{
    timestamps: true
}
)

const InternalMessage = model('InternalMessage', InternalMessageSchema)

export default InternalMessage