import { model, Schema } from 'mongoose';

const patternsSchema = new Schema(
    {
        idPattern: {
            type: Schema.Types.Number,
            required: true,
            unique: true
        },
        type: {
            type: Schema.Types.String,
            required: true,
            unique: false
        },
        brand: {
            type: Schema.Types.String,
            required: true,
            unique: false
        },
        model: {
            type: Schema.Types.String,
            required: true,
            unique: false
        },
        pIDPM: {
            type: Schema.Types.String,
            required: true,
            unique: false
        },
        zone: {
            type: Schema.Types.String,
            required: true,
            unique: false
        }
    },
    {
        timestamps: true
    }
)

const Patterns = model('Patterns', patternsSchema)

export default Patterns