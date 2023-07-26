import { Router } from 'express';
import { News, Users } from '../models';
const router = new Router()

router.post('/createNewsText', async (req, res) => {
    const {news: {titulo, comentario, roles, obras}} = req.body
    try {
        if (roles.length > 0 && obras.length > 0) {
            const findUsers = await Users.find({roles: { $in: roles }, obras: { $in: obras}})
            const usuariosAsignados = []
            findUsers.forEach((usuario) => {
                usuariosAsignados.push(usuario._id)
            })
            const noticiaParaGuardar = {
                titulo: titulo,
                comentario: comentario,
                usuarios: usuariosAsignados
            }
            const response = await News.create(noticiaParaGuardar)
            res.status(200).json({message: 'Noticia creada exitosamente.', data: response, state: true})
        } else {
            res.status(401).json({message: 'Faltan los roles o las obras', state: false})
        }
    } catch (error) {
        res.status(400).json({message: 'Error al grear la noticia', data: error, state: false})
    }
})

router.post('/createNewWithImage', async (req, res) => {
    const {news: {titulo, comentario, roles, obras, urlFoto, nombreFoto}} = req.body
    try {
        if (roles.length > 0 && obras.length > 0) {
            const findUsers = await Users.find({roles: { $in: roles }, obras: { $in: obras}})
            const usuariosAsignados = []
            findUsers.forEach((usuario) => {
                usuariosAsignados.push(usuario._id)
            })
            const noticiaParaGuardar = {
                titulo: titulo,
                comentario: comentario,
                usuarios: usuariosAsignados,
                urlFoto: urlFoto,
                nombreFoto: nombreFoto
            }
            const response = await News.create(noticiaParaGuardar)
            res.status(200).json({message: 'Noticia creada exitosamente.', data: response, state: true})
        } else {
            res.status(401).json({message: 'Faltan los roles o las obras', state: false})
        }
    } catch (error) {
        res.status(400).json({message: 'Error al grear la noticia', data: error, state: false})
    }
})

router.post('/createNewWithVideo', async (req, res) => {
    const {news: {titulo, comentario, roles, obras, urlVideo, nombreVideo}} = req.body
    try {
        if (roles.length > 0 && obras.length > 0) {
            const findUsers = await Users.find({roles: { $in: roles }, obras: { $in: obras}})
            const usuariosAsignados = []
            findUsers.forEach((usuario) => {
                usuariosAsignados.push(usuario._id)
            })
            const noticiaParaGuardar = {
                titulo: titulo,
                comentario: comentario,
                usuarios: usuariosAsignados,
                urlVideo: urlVideo,
                nombreVideo: nombreVideo
            }
            const response = await News.create(noticiaParaGuardar)
            res.status(200).json({message: 'Noticia creada exitosamente.', data: response, state: true})
        } else {
            res.status(401).json({message: 'Faltan los roles o las obras', state: false})
        }
    } catch (error) {
        res.status(400).json({message: 'Error al grear la noticia', data: error, state: false})
    }
})

router.post('/getMyNews', async (req, res) => {
    try {
        const {userId} = req.body
        const response = await News.find({usuarios: {$in: [userId]}})
        console.log(response)

        res.status(200).json({message: 'Noticias encontradas', data: response, state: true})
    } catch (error) {
        res.status(400).json({message: 'Error de lectura', state: false})
    }
})

/* const removeUsersDuplicated = (users) => {
    return users.filter((user, index) => users.indexOf(user) === index)
} */

export default router