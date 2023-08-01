import { InternalMessage } from "../models";


const sendMessage = async (req, res) => {
    const { message } = req.body;

    try{
        const messageResponse = new InternalMessage(message);
        await messageResponse.save();
        res.send(messageResponse)
    } catch(err) {

    }
}

const removeMessage = async (req, res) => {
    const { _id } = req.body;

    try{
        InternalMessage.findByIdAndRemove(_id, {}, (err, data) => {
            if(err) {
                res.send({
                    message: 'Error al intentar borrar la consulta.'
                })
            };
            res.send(data)
        })
    } catch(err) {

    }
}


const getMessagesByUser = (req, res) => {
    const {_id} = req.body;

    try{
        InternalMessage.find({from: _id}, (err, data) => {
            if(err) {
                res.send({
                    message: 'Error en los datos'
                })
            };
            res.send(data)
        })
    }catch(err){

    }
}


const getAllMessages = (req, res) => {
    try{
        InternalMessage.find({}, (err, data) => {
            /* console.log(data.data) */
            if(err) {
                res.send({
                    message: 'Error en los datos'
                })
            };
            res.send(data)
        })
    }catch(err){

    }
}

export default {
    sendMessage,
    removeMessage,
    getMessagesByUser,
    getAllMessages
}