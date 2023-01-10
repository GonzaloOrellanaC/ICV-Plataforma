import { model, Schema } from 'mongoose';

const patternDetailSchema = new Schema(
    {
        /* action: {
            type: Schema.Types.String,
            required: true,
            unique: false
        }, */
        cantidadMec: {
            type: Schema.Types.Number,
            required: true,
            unique: false
        },
        hhEstandar: {
            type: Schema.Types.Number,
            required: true,
            unique: false
        },
        hhTrabajadas: {
            type: Schema.Types.Number,
            required: true,
            unique: false
        },
        hmEstandar: {
            type: Schema.Types.Number,
            required: true,
            unique: false
        },
        horasOperacion: {
            type: Schema.Types.Number,
            required: true,
            unique: false
        },
        id: {
            type: Schema.Types.Number,
            required: true,
            unique: false
        },
        idpm: {
            type: Schema.Types.String,
            required: true,
            unique: false
        },
        idreg: {
            type: Schema.Types.Number,
            required: true,
            unique: false
        },
        obs01: {
            type: Schema.Types.String,
            required: true,
            unique: false
        },
        typepm: {
            type: Schema.Types.String,
            required: true,
            unique: false
        },
        zone: {
            type: Schema.Types.String,
            required: true,
            unique: false
        },
        header: [
            {
                type: Object
            }
        ],
        struct: [
            {
                type: Object
            }
        ]
    },
    {
        timestamps: true
    }
)

const PatternDetail = model('PatternDetail', patternDetailSchema)

export default PatternDetail