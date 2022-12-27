/* Mongoose */
import { model, Schema } from 'mongoose'

/* Site Schema */
const SitesSchema = new Schema(
    {
        descripcion: {
            type: Schema.Types.String,
            required: true
        },
        idobra: {
            type: Schema.Types.String,
            required: true
        },
        image: {
            type: Schema.Types.String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

const Site = model('Site', SitesSchema)

export default Site
