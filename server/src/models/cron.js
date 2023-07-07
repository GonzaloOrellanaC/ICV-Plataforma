/* Mongoose */
import { model, Schema } from 'mongoose'

/* Cron Schema */
const CronSchema = new Schema({
    timePautas: {
        type: Schema.Types.String,
    },
    timeMachines: {
        type: Schema.Types.String,
    }
},
{
    timestamps: true
}
)

const Cron = model('Cron', CronSchema)

export default Cron