/* Mongoose */
import { model, Schema } from 'mongoose'

/* Site Schema */
const UnidadesSchema = new Schema(
    {
        idUnidad: {
            type: Schema.Types.String
        },
        descripcion: {
            type: Schema.Types.String
        },
        inputRequerido: {
            type: Schema.Types.String
        },
        inputCantidad: {
            type: Schema.Types.Number
        }
    },
    {
        timestamps: true
    }
)

const Unidades = model('Unidades', UnidadesSchema)

export default Unidades