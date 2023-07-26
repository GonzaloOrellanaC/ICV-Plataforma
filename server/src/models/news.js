import { model, Schema } from 'mongoose';

const newsSchema = new Schema(
    {
        titulo: {
            type: Schema.Types.String
        },
        comentario: {
            type: Schema.Types.String
        },
        urlVideo: {
            type: Schema.Types.String
        },
        urlFoto: {
            type: Schema.Types.String
        },
        nombreVideo: {
            type: Schema.Types.String
        },
        nombreFoto: {
            type: Schema.Types.String
        },
        usuarios: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true
    }
)

const News = model('News', newsSchema)

export default News