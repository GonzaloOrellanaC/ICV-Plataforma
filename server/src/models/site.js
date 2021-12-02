/* Mongoose */
import { model, Schema } from 'mongoose'

/* Site Schema */
const SitesSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        users: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true
    }
)

const Site = model('Site', SitesSchema)

export default Site
