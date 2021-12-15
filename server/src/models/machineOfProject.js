/* Mongoose */
import { model, Schema } from 'mongoose'

/* Machine Schema */
const MachineOfProjectSchema = new Schema({
    machineId: {
        type: Schema.Types.Number,
        required: true
    },
    type: {
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
    pIDPM: {
        type: Schema.Types.String,
    }
},
{
    timestamps: true
}
)

const MachineOfProject = model('MachineOfProject', MachineOfProjectSchema)

export default MachineOfProject