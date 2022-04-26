/* Mongoose */
import { model, Schema } from 'mongoose'

/* Notification Schema */
const NotificationsSchema = new Schema(
    {
        userId: {
            type: Schema.Types.String,
        },
        from: {
            type: Schema.Types.String,
        },
        title: {
            type: Schema.Types.String,
        },
        subtitle: {
            type: Schema.Types.String,
        },
        message: {
            type: Schema.Types.String,
        },
        state: {
            type: Schema.Types.Boolean,
        },
        url: {
            type: Schema.Types.String,
        },
        historyData: {
            userId: {
                type: Schema.Types.ObjectId
            },
            dataType: {
                type: Schema.Types.String
            },
            message: {
                type: Schema.Types.String
            }
        }
    },
    {
        timestamps: true
    }
)

const Notification = model('Notification', NotificationsSchema)

export default Notification