/* Mongoose */
import { model, Schema } from 'mongoose'

const ReplacementSchema = new Schema({
    partNumber: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        default: null
    },
    partNumberImage: {
        // Add photo reference, blob storage link for example
    },
    otherObservations: {
        type: String,
        default: ''
    }
})

/* AssignedInspection Schema */
const AssignedInspectionsSchema = new Schema({
    number: {
        type: String,
        required: true
    },
    info: {
        /* machineAssociated: {
            type: Schema.Types.ObjectId,
            ref: 'Machine'
        }, */
        hourMeter: {
            type: Number,
            required: true
        },
        inspectionDate: {
            type: Date,
            required: true
        },
        inspectionReason: {
            type: String,
            required: true
        },
        component: {
            type: String,
            required: true
        },
        site: {
            type: String,
            required: true
        },
        assignedInspector: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    failureDescription: {
        type: String,
        default: ''
    },
    failureImage: {
        // Add photo reference, blob storage link for example
    },
    priority: {
        type: String,
        default: ''
    },
    recommendedJobs: {
        type: String,
        default: ''
    },
    replacements: [ReplacementSchema],
    materialsToUse: {
        type: String,
        default: ''
    }
},
{
    timestamps: true
}
)

const AssignedInspections = model('AssignedInspection', AssignedInspectionsSchema)

export default AssignedInspections
