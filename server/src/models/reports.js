/* Mongoose */
import { model, Schema } from 'mongoose'

/* User Schema */
const ReportShema = new Schema({
    createdBy: {
        type: Schema.Types.String
    },
    updatedBy: {
        type: Schema.Types.String
    },
    enabled: {
        type: Schema.Types.Boolean,
        default: true
    },
    usersAssigned: {
        type: Schema.Types.Array
    },
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
    idIndex: {
        type: Schema.Types.Number
    }
},
{
    timestamps: true
}
)

const Reports = model('Reports', ReportShema)

export default Reports