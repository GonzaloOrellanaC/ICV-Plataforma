import { model, Schema } from 'mongoose';

const marcaSchema = new Schema(
    {
        marca: {
            type: Schema.Types.String
        }
    },
    {
        timestamps: true
    }
)

const Marca = model('Marca', marcaSchema)

export default Marca