import { EmailMailgunServices, EmailServices, UserServices } from '../services'
import { Users } from '../models'

const createUser = async  (req, res, next) => {
    
    const { body: { userData, password } } = req


    if (!userData.email || !password) {
        //return res.status(400).end(errorMsg.informationMissing)
    }

    try {
        const registerUser = await UserServices.createUser(userData, password)
        if(registerUser && userData.email) {
            const emailSenderState = await EmailServices.sendEmail('newUser', `${userData.name} ${userData.lastName}`, 'es', userData.email, password)
            //EmailServices.sendEmail('newUser', `${userData.name} ${userData.lastName}`, 'es', userData.email, password )
            //const emailSenderState = await EmailMailgunServices.sendEmail('newUser', `${userData.name} ${userData.lastName}`, 'es', userData.email, password)
            if(emailSenderState) {
                res.status(200).json({ user: registerUser, email: 'Sended' })
            }else{
                res.status(200).json({ user: registerUser, email: 'Not sended' })
            }
        } else if (registerUser && !userData.email) {
            res.status(200).json({ user: registerUser, data: 'user created' })
        }else{
            res.status(400).end({message: 'Error al guardar usuario'})
        }
        //return res.status(200).json({ user: registerUser.generateJWT() })
    } catch (error) {
        res.status(400).end(error.message)
    }
}

const editUser = async  (req, res, next) => {
    
    const { body: { userData, id } } = req


    try {
        const editingUser = await UserServices.editUser(userData, id);

        res.json(editingUser)
        
        //return res.status(200).json({ user: registerUser.generateJWT() })
    } catch (error) {
        return res.status(400).end(error.message)
    }
}

const findByRut = async  (req, res, next) => {
    
    const { body: { rut } } = req


        try {
            await Users.find({rut: rut}, (err, user) => {
                if(err) throw err;
                if(user.length > 0) {
                    res.send(true)
                }else{
                    res.send(false)
                }
            });
        } catch (error) {
            //return res.status(400).end(error.message)
        }
    
}

const findByRole = async  (req, res, next) => {
    
    const { body: { role } } = req


        try {
            await Users.find({role: role}, (err, users) => {
                if(err) throw err;
                if(users.length > 0) {
                    res.send(users)
                }else{
                    res.send(false)
                }
            });
        } catch (error) {

        }
    
}

const readAllUsers = async (req, res, next) => {
    try {
        const users = await Users.find().populate('obras')
        console.log(users.length)
        res.status(200).json(users)
        /* Users.find({}, (err, users) => {
            res.json(users)
        }); */
    } catch (err) {

    }
}

const getMantenedores = (req, res, next) => {
    try {
        Users.find({$or : [{role:'maintenceOperator'}, {roles:'maintenceOperator'}]}, (err, users) => {
            res.json(users)
            /* Users.find({roles:'maintenceOperator'}, (err, users2) => {
                console.log(users2)
                userList.concat(users2)
                console.log(userList)
                res.json(userList)
            }) */
        })
    } catch (err) {

    }
}

const getOperadores = (req, res, next) => {
    try {
        Users.find({$or : [{role:'inspectionWorker'}, {roles:'inspectionWorker'}]}, (err, users) => {
        /* Users.find({role:'inspectionWorker'}, (err, users) => { */
            res.json(users)
            /* Users.find({roles:'inspectionWorker'}, (err, users2) => {
                res.json(userList.concat(users2))
            }) */
        })
    } catch (err) {

    }
}

const readUser = (req, res, next) => {
    const { body } = req;
    try{
        Users.findById(body.id, (err, user) => {
            res.json(user)
        });
    }catch (err) {
        console.log(err)
    }
}

const getUserSign = (req, res, next) => {
    const { body } = req;
    console.log(body)
    try{
        Users.findById(body.id, (err, user) => {
            if (err) {
                res.status(400).end({message: 'error', error: err})
            }
            if (user) {
                res.json(user.sign)
            }
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
    getMantenedores,
    getOperadores,
    readUser,
    getUserSign,
    deleteUser,
    editUser,
    findByRut,
    findByRole
}