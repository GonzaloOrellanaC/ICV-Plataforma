/* Mongoose */
import { model, Schema } from 'mongoose'

const partsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
})

const sectionsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    parts: [partsSchema]
})

/* MachinePrototype Schema */
const MachinePrototypesSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    sections: [sectionsSchema],
    maintenanceGuides: [{
        type: Schema.Types.ObjectId,
        ref: 'MaintenanceGuide'
    }]
},
{
    timestamps: true
}
)

const MachinePrototypes = model('MachinePrototype', MachinePrototypesSchema)

export default MachinePrototypes
