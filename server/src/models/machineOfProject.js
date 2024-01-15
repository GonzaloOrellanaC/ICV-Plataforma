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
    typeId: {
        type: Schema.Types.ObjectId,
        ref: 'Tipo'
    },
    brand: {
        type: Schema.Types.String,
        required: true
    },
    brandId: Schema.Types.ObjectId,
    model: {
        type: Schema.Types.String,
        required: true
    },
    modelId: Schema.Types.ObjectId,
    pIDPM: {
        type: Schema.Types.String,
    },
    urlImagen: {
        type: Schema.Types.String
    }
},
{
    timestamps: true
}
)

const MachineOfProject = model('MachineOfProject', MachineOfProjectSchema)

export default MachineOfProject