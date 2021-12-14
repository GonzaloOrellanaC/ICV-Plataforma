import { EmailServices, UserServices } from '../services'
import { Users } from '../models'

const createUser = async  (req, res, next) => {
    
    const { body: { userData, password } } = req

    console.log('Respuestas: ',userData, password)

    if (!userData.email || !password) {
        //return res.status(400).end(errorMsg.informationMissing)
    }

    try {
        const registerUser = await UserServices.createUser(userData, password)
        if(registerUser) {
            EmailServices.sendEmail('newUser', `${userData.name} ${userData.lastName}`, 'es', userData.email )
        }
        return res.status(200).json({ user: registerUser.generateJWT() })
    } catch (error) {
        console.log(error)
        return res.status(400).end(error.message)
    }
}

const editUser = async  (req, res, next) => {
    
    const { body: { userData } } = req

    console.log('Respuestas: ',userData)

    try {
        const editingUser = await UserServices.editUser(userData);

        res.json(editingUser)
        
        //return res.status(200).json({ user: registerUser.generateJWT() })
    } catch (error) {
        console.log(error)
        return res.status(400).end(error.message)
    }
}

const readAllUsers = (req, res, next) => {
    try {
        Users.find({}, (err, users) => {
            console.log('Usuarios: ', users)
            res.json(users)
        });
    } catch (err) {

    }
}

const readUser = (req, res, next) => {
    const { body } = req;
    //console.log(body)
    try{
        Users.findById(body.id, (err, user) => {
            //console.log('Usuario: ', user)
            res.json(user)
        });
    }catch (err) {
        console.log(err)
    }
}

const deleteUser = (req, res, next) => {
    const { body } = req;
    try{
        Users.findByIdAndDelete(body.id, (err, response) => {
            res.json(response)
        });
    }catch (err) {
        console.log(err)
    }
}

export default {
    createUser,
    readAllUsers,
    readUser,
    deleteUser,
    editUser
}