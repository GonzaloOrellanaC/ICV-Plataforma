/* Mongoose */
import { model, Schema } from 'mongoose'
import { FormSectionSchema } from './maintenancePlan'

/* AssignedMaintenance Schema */
const AssignedMaintenancesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    info: {
        /* machineAssociated: {
            type: Schema.Types.ObjectId,
            ref: 'Machine'
        }, */
        /* machinePrototype: {
            type: Schema.Types.ObjectId,
            ref: 'MachinePrototype',
            required: true
        }, */
        documentId: {
            type: String,
            default: ''
        },
        HM: {
            type: Number,
            required: true
        },
        MecNum: {
            type: Number,
            required: true
        },
        OpHrs: {
            type: Number,
            required: true
        },
        characteristic: {
            type: String,
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    form: [FormSectionSchema]
},
{
    timestamps: true
}
)

const AssignedMaintenances = model('AssignedMaintenance', AssignedMaintenancesSchema)

export default AssignedMaintenances
