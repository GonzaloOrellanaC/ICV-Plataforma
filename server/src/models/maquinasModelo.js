import { model, Schema } from 'mongoose';

const modeloSchema = new Schema(
    {
        modelo: {
            type: Schema.Types.String
        },
        marca: {
            type: Schema.Types.ObjectId,
            ref: 'Marca'
        }
    },
    {
        timestamps: true
    }
)

const Modelo = model('Modelo', modeloSchema)

export default Modelo