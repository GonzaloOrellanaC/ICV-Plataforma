/* Mongoose */
import { model, Schema } from 'mongoose'

/* User Schema */
const ExecutionReport2Shema = new Schema(
    {
        reportId: {
            type: Schema.Types.ObjectId,
            ref: 'Reports2'
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        astList: Schema.Types.Array,
        group: {
            type: Object
        },
        offLineGuard: {
            type: Schema.Types.Number
        }
    },
    {
        timestamps: true,
        strict: false
    })

const ExecutionReport2 = model('ExecutionReport2', ExecutionReport2Shema)

export default ExecutionReport2