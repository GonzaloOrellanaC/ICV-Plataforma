/* Mongoose */
import { model, Schema } from 'mongoose'

/* User Schema */
const ReportShema = new Schema({
    sapId: {
        type: Schema.Types.String
    },
    createdBy: {
        /* type: Schema.Types.String */
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        /* type: Schema.Types.String */
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    shiftManagerApprovedBy: {
        /* type: Schema.Types.String */
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    shiftManagerApprovedDate: {
        type: Schema.Types.Date
    },
    shiftManagerApprovedCommit: {
        type: Schema.Types.String
    },
    chiefMachineryApprovedBy: {
        /* type: Schema.Types.String */
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    chiefMachineryApprovedDate: {
        type: Schema.Types.Date
    },
    chiefMachineryApprovedCommit: {
        type: Schema.Types.String
    },
    sapExecutiveApprovedBy: {
        /* type: Schema.Types.String */
        type: Schema.Types.ObjectId,
        ref: 'User'
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
            /* type: Schema.Types.Array */
            type: Schema.Types.ObjectId,
            ref: 'User'
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
        type: Schema.Types.String
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