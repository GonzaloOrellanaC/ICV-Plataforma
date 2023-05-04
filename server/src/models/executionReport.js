/* Mongoose */
import { model, Schema } from 'mongoose'

/* User Schema */
const ExecutionReportShema = new Schema({
    report: {
        type: Schema.Types.ObjectId,
        ref: 'Reports'
    },
    reportId: {
        type: Schema.Types.String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    astList: [
        {
            id: {
                type: Schema.Types.Number
            },
            image: {
                type: Schema.Types.String
            },
            imageUrl: {
                type: Schema.Types.String
            }
        }
    ],
    group: {
        type: Object
    },
    offLineGuard: {
        type: Schema.Types.Number
    }
},{timestamps: true, strict: false})

const ExecutionReport = model('ExecutionReport', ExecutionReportShema)

export default ExecutionReport