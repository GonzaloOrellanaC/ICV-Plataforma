/* Mongoose */
import { model, Schema } from 'mongoose'

/* User Schema */
const ExecutionReportShema = new Schema({},{timestamps: true, strict: false})

const ExecutionReport = model('ExecutionReport', ExecutionReportShema)

export default ExecutionReport