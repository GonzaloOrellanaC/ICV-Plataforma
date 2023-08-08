import { EmailMailgunServices, EmailServices, UserServices } from '../services'
import { Users } from '../models'
import { Sentry } from '../services/sentry.services'

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
        if (userData && id) {
            const editingUser = await UserServices.editUser(userData, id);
            res.json(editingUser)
        } else {
            res.json([])
        }
        
        //return res.status(200).json({ user: registerUser.generateJWT() })
    } catch (error) {
        Sentry.captureEvent(error)
        return res.status(400).end(error.message)
    }
}

const findByRut = async  (req, res, next) => {
    
    const { body: { rut } } = req


        try {
            if (rut) {
                const users = await Users.find({rut: rut})
                if (users.length > 0) {
                    res.send(true)
                } else {
                    res.send(false)
                }
            }
            /* await Users.find({rut: rut}, (err, user) => {
                if(err) throw err;
                if(user.length > 0) {
                    res.send(true)
                }else{
                    res.send(false)
                }
            }); */
        } catch (error) {
            res.send(false)
            Sentry.captureEvent(error)
            //return res.status(400).end(error.message)
        }
    
}

const findByRole = async  (req, res, next) => {
    const { body: { role } } = req
        try {
            if (role) {
                const users = await Users.find({role: role})
                res.send(users)
            } else {
                res.send([])
            }
            /* await Users.find({role: role}, (err, users) => {
                if(err) throw err;
                if(users.length > 0) {
                    res.send(users)
                }else{
                    res.send(false)
                }
            }); */
        } catch (error) {
            Sentry.captureEvent(error)
            res.send([])
        }
    
}

const readAllUsers = async (req, res, next) => {
    try {
        const query = {
            isTest: false
        }
        const queryAdmin = {}
        const users = await Users.find((req.body.admin || req.body.isTest) ? queryAdmin : query).populate('obras')
        /* console.log(users.length) */
        res.status(200).json(users)
        /* Users.find({}, (err, users) => {
            res.json(users)
        }); */
    } catch (err) {

    }
}

const getMantenedores = async (req, res, next) => {
    try {
        const query = {
            $or : [{role:'inspectionWorker'}, {roles:'inspectionWorker'}],
            isTest: false
        }
        const queryAdmin = {
            $or : [{role:'inspectionWorker'}, {roles:'inspectionWorker'}]
        }
        const users = await Users.find(req.body.admin ? queryAdmin : query).populate('obras')
        res.status(200).json({data: users})
    } catch (err) {

    }
}

const getOperadores = async (req, res, next) => {
    try {
        const query = {
            $or : [{role:'inspectionWorker'}, {roles:'inspectionWorker'}],
            isTest: false
        }
        const queryAdmin = {
            $or : [{role:'inspectionWorker'}, {roles:'inspectionWorker'}]
        }
        const users = await Users.find(req.body.admin ? queryAdmin : query).populate('obras')
        res.status(200).json({data: users})
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

const getUserSign = async (req, res, next) => {
    const { body } = req;
    /* console.log(body) */
    try{
        const user = await Users.findById(body.id)
        if (user) {
            res.json(user.sign)
        } else {
            res.status(400).end({message: 'error'})
        }
    }catch (err) {
        res.status(400).end({message: 'error', error: err})
        console.log(err)
        Sentry.captureEvent(err)
    }
}


const deleteUser = (req, res, next) => {
    const { body } = req;
    try{
        Users.findByIdAndDelete(body.id, (err, response) => {
            if (err) {
                Sentry.captureEvent(err)
            }
            res.json(response)
        });
    }catch (error) {
        console.log(error)
        Sentry.captureEvent(error)
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