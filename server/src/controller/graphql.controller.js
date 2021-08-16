import { Users } from '../models'
import Schema from '../schema'
import { environment } from '../config'

const { error: errorMsg } = environment.messages.controller.graphql

const graphql = async (req, res, next) => {
    const { payload: { id } } = req
    const user = await Users.findById(id)
    console.log(user)
    if (!user.enabled) {
        return res.status(401).end(errorMsg.userDisabled)
    }

    return ({
        schema: Schema,
        graphiql: true,
        context: {
            user
        }
    })
}

export default {
    graphql
}
