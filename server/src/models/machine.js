/* Mongoose */
import { model, Schema } from 'mongoose'

/* Machine Schema */
const MachineSchema = new Schema({
    number: {
        type: String,
        required: true
    },
    machinePrototype: {
        type: Schema.Types.ObjectId,
        ref: 'MachinePrototype',
        required: true
    },
    procedures: {
        assignedMaintenances: [{
            type: Schema.Types.ObjectId,
            ref: 'AssignedMaintenance'
        }],
        assignedInspections: [{
            type: Schema.Types.ObjectId,
            ref: 'AssignedInspection'
        }]
    },
    division: {
        type: Schema.Types.ObjectId,
        ref: 'Division'
    }
},
{
    timestamps: true
}
)

const Machine = model('Machine', MachineSchema)

export default Machine
