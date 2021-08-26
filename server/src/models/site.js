/* Mongoose */
import { model, Schema } from 'mongoose'

/* Site Schema */
const SitesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
)

const Sites = model('Site', SitesSchema)

export default Sites
