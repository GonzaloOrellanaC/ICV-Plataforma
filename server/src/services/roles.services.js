import { Roles } from '../models'


const getRoles = async (req, res) => {
    try {
        Roles.find({}, (err, roles) => {
            console.log('Roles: ', roles)
            res.json(roles)
        });
    } catch (err) {

    }
}

export default {
    getRoles
}