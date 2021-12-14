import { Permisos, Users } from '../models'


const getPermisos = async (req, res) => {
    try {
        Permisos.find({}, (err, permisos) => {
            console.log('Roles: ', permisos)
            res.json(permisos)
        });
    } catch (err) {

    }
}

const getPermisosByUser = async (req, res) => {
    const { body } = req;
    console.log(body)
    try{
        Users.findById(body.id, (err, user) => {
            let permissionsReports = user.permissionsReports;
            let permissionsUsers = user.permissionsUsers;
            res.json({
                permissionsReports: permissionsReports,
                permissionsUsers: permissionsUsers
            })
        });
    }catch (err) {
        console.log(err)
    }
}

export default {
    getPermisos,
    getPermisosByUser
}