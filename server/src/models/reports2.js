/* Mongoose */
import { model, Schema } from 'mongoose'

/* User Schema */
const ReportShema = new Schema({
    sapId: {
        type: Schema.Types.String
    },
    createdBy: {
        type: Schema.Types.ObjectId
    },
    updatedBy: {
        type: Schema.Types.ObjectId
    },
    shiftManagerApprovedBy: {
        type: Schema.Types.ObjectId
    },
    shiftManagerApprovedDate: {
        type: Schema.Types.Date
    },
    shiftManagerApprovedCommit: {
        type: Schema.Types.String
    },
    chiefMachineryApprovedBy: {
        type: Schema.Types.ObjectId
    },
    chiefMachineryApprovedDate: {
        type: Schema.Types.Date
    },
    chiefMachineryApprovedCommit: {
        type: Schema.Types.String
    },
    sapExecutiveApprovedBy: {
        type: Schema.Types.ObjectId
    },
    sapExecutiveApprovedDate: {
        type: Schema.Types.Date
    },
    sapExecutiveApprovedCommit: {
        type: Schema.Types.String
    },
    enabled: {
        type: Schema.Types.Boolean,
        default: true
    },
    usersAssigned: [
        {
            type: Schema.Types.ObjectId
        }
    ],
    state: {
        type: Schema.Types.String
    },
    site: {
        type: Schema.Types.String
    },
    reportType: {
        type: Schema.Types.String
    },
    machine: {
        type: Schema.Types.String
    },
    guide: {
        type: Schema.Types.String
    },
    datePrev: {
        type: Schema.Types.Date
    },
    endPrev: {
        type: Schema.Types.Date
    },
    level: {
        type: Schema.Types.Number
    },
    endReport: {
        type: Schema.Types.Date
    },
    dateInit: {
        type: Schema.Types.Date
    },
    dateClose: {
        type: Schema.Types.Date
    },
    idIndex: {
        type: Schema.Types.Number
    },
    idPm: {
        type: Schema.Types.ObjectId /* Se modifica IDPM por ID Mongo */
    },
    testMode: {
        type: Schema.Types.Boolean
    },
    deleted: {
        type: Schema.Types.Boolean,
        default: false
    },
    history: {
        type: Schema.Types.Array,
        default: []
    },
    readyToSend: {
        type: Schema.Types.Boolean
    },
    urlPdf: {
        type: Schema.Types.String
    }
},
{
    timestamps: true
}
)

const Reports = model('Reports', ReportShema)

export default Reports