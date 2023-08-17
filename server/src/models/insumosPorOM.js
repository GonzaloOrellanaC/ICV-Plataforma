/* Mongoose */
import { model, Schema } from 'mongoose'

/* Cron Schema */
const InsumosPorReporteSchema = new Schema({
    om: {
        type: String
    },
    ejecucionDeReporte: {
        type: Array,
    },
    datosReporte: {
        type: Object,
    }
},
{
    timestamps: true
}
)

const InsumosPorReporte = model('InsumosPorReporte', InsumosPorReporteSchema)

export default InsumosPorReporte