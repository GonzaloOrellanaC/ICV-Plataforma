import { model, Schema } from 'mongoose';

const permisosSchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
            unique: true
        },
        resources: {
            type: Schema.Types.Array,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
)

const Permisos = model('Permisos', permisosSchema)

export default Permisos