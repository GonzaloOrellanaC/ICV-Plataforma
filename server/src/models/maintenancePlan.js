/* Mongoose */
import { model, Schema } from 'mongoose'

const FormItemSchema = new Schema({
    necessaryPersonel: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    observations: {
        type: String,
        required: true
    },
    partNumberToUse: {
        type: String,
        default: null
    },
    quantity: {
        type: Number,
        default: null
    },
    unit: {
        type: String,
        default: null
    },
    replacementType: {
        type: String,
        default: null,
        validate: {
            validator: (value) => [null, 'C', 'R', 'Op'].includes(value),
            message: props => `${props.value} it's not a correct replacementType, has to be one of [null, 'C', 'R', 'Op']`
        }
    },
    finishedjob: {
        type: Boolean,
        default: null
    },
    referredPart: {
        // References ID of part in MachinePrototype->Sections->Parts
        type: Schema.Types.ObjectId
    }
})

export const FormSectionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    items: [FormItemSchema]
})

/* MaintenancePlan Schema */
const MaintenancePlanSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    info: {
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
        }
    },
    form: [FormSectionSchema]
},
{
    timestamps: true
}
)

/**
 * Template Virtual
 * Allows to obtain a virtual document property with the full name of the template without
 * saving it to the database by concatenating code and name in the correct way
 */
MaintenancePlanSchema.virtual('templateName')
    .get(function () { return `${this.code} - ${this.name}` })

const MaintenancePlan = model('MaintenancePlan', MaintenancePlanSchema)

export default MaintenancePlan
