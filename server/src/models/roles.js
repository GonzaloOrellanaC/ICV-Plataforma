import { model, Schema } from 'mongoose';

const rolesSchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
            unique: true
        },
        dbName: {
            type: Schema.Types.String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
)

const Roles = model('Roles', rolesSchema)

export default Roles