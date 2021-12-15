import { model, Schema } from 'mongoose';

const permissionSchema = new Schema(
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

const Permission = model('Permission', permissionSchema)

export default Permission