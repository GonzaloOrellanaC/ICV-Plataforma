/* Mongoose */
import { model, Schema } from 'mongoose'

/* Machine Schema */
const MachineSchema = new Schema({
    equ: {
        type: Schema.Types.String,
        required: true
    },
    equid: {
        type: Schema.Types.String,
        required: true
    },
    brand: {
        type: Schema.Types.String,
        required: true
    },
    model: {
        type: Schema.Types.String,
        required: true
    },
    enginesnr: {
        type: Schema.Types.String,
    },
    idobra: {
        type: Schema.Types.String,
        required: true
    },
    idpminspeccion: {
        type: Schema.Types.String,
        required: true
    },
    idpmmantencion: {
        type: Schema.Types.String,
        required: true
    },
    hourMeter: {
        type: Schema.Types.Number,
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

const Machine = model('Machine', MachineSchema)

export default Machine
