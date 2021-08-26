/* Mongoose */
import { model, Schema } from 'mongoose'

/* Machine Schema */
const MachinesSchema = new Schema({
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
    }
},
{
    timestamps: true
}
)

const Machines = model('Machine', MachinesSchema)

export default Machines
