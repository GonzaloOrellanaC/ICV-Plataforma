import { model, Schema } from 'mongoose';

const tipoSchema = new Schema(
    {
        tipo: {
            type: Schema.Types.String
        }
    },
    {
        timestamps: true
    }
)

const Tipo = model('Tipo', tipoSchema)

export default Tipo