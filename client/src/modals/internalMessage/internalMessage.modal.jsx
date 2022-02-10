import { useState, useEffect } from 'react';
import { 
    Box, 
    Modal,
    Toolbar,
    Fab,
    Input,
    TextareaAutosize,
    Grid,
    Button,

} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { dateWithTime, styleInternalMessageModal } from '../../config';
import { internalMessagesRoutes } from '../../routes';

const InternalMessageModal = ({open, report, closeModal}) => {
    const [ messages, setMessages ] = useState([]);
    const [ message, setMessage ] = useState('');
    const [ subject, setSubject ] = useState('');
    const _id = localStorage.getItem('_id')

    useEffect(() => {
        internalMessagesRoutes.getMessagesByUser(_id).then(data => {
            setMessages(data.data.reverse())
        })
    }, []);

    const sendMessage = () => {
        if((subject.length > 0) && (message.length > 1)) {
            let messageToSend = {
                sendDate: Date.now(),
                message: message,
                from: localStorage.getItem('_id'),
                subject: subject,
            };
            if(navigator.onLine) {
                internalMessagesRoutes.sendMessage(messageToSend).then(data=>{
                    internalMessagesRoutes.getMessagesByUser(_id).then(d => {
                        setMessages(d.data.reverse())
                    })
                    alert('Mensaje enviado.');
                    setMessage('');
                    setSubject('');
                })
            }else{
                alert('Error de red')
            }
        }else{
            alert('Asunto y comentario son obligatorios.')
        }
        
    }

    const removeMessage = (_id, index) => {
        if(navigator.onLine) {
            if(confirm('Confirme la eliminación de su consulta.')) {
                internalMessagesRoutes.removeMessage(_id).then(data => {
                    console.log(data.data);
                    let newMessages = messages.filter(m => {if(m._id === data.data._id){}else{return m}});
                    setMessages(newMessages)
                    alert('Mensaje borrado.')
                })
            }
        }
    }
    
    
    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleInternalMessageModal}>
                <Grid container style={{paddingTop: 50}}>
                    <Grid item xl={4} md={3} sm={2} xs={null}> 

                    </Grid>
                    <Grid item xl={4} md={6} sm={8} xs={12}>
                    <div>
                        <h1>Dejenos sus comentarios de la aplicación.</h1>
                        <Input value={subject} onChange={(e)=>{setSubject(e.target.value)}} placeholder='Asunto' style={{width: '100%', fontSize: 18, fontFamily: 'Raleway'}} />
                        <br />
                        <br />
                        <TextareaAutosize 
                        aria-label="empty textarea"
                        placeholder="Deje su comentario"
                        minRows={10}
                        maxRows={15}
                        style={{ width: '100%', fontSize: 18, fontFamily: 'Raleway' }}
                        value={message}
                        onChange={(e)=>{setMessage(e.target.value)}}
                        />
                    </div>
                    <br />
                    <br />
                    <Button variant="contained" color={'primary'} style={{ borderRadius: 50 }} onClick={()=>{sendMessage()}}>
                        Enviar Mensaje
                    </Button>
                    </Grid>
                    <Grid item xl={4} md={3} sm={2} xs={null}> 

                    </Grid>
                </Grid>
                <Grid container style={{paddingTop: 50}}>
                    <Grid item xl={4} md={3} sm={2} xs={null}> 

                    </Grid>
                    <Grid item xl={4} md={6} sm={8} xs={12}>
                        <div style={{overFlow: 'auto', maxHeight: 200, display: 'block'}}>
                            {
                                messages.map((e, i) => {
                                    if(!e.answer) {
                                        e.answer = 'No hay respuesta.'
                                    }
                                    return(
                                        <div key={i} style={{width: '100%', fontSize: 16, padding: 10, borderRadius: 20, borderStyle: 'solid', borderWidth: 1, borderColor: '#000', marginBottom: 30}}>
                                            
                                            <div style={{position: 'relative', top: 0, width: '100%'}}>
                                            <Fab onClick={()=>{removeMessage(e._id, i)}} style={{position: 'absolute', right: 0, top: 0, boxShadow: 'none', backgroundColor: 'transparent'}}>
                                                <Close style={{color: '#ccc'}} />
                                            </Fab>
                                            </div>
                                            <p><b>{e.subject}</b></p>
                                            <p style={{whiteSpace: 'pre-line'}}>{e.message}</p>
                                            <p style={{textAlign: 'right'}}>Enviado {dateWithTime(e.sendDate)} </p>
                                            <p><b>Respuesta:</b></p>
                                            <p>{e.answer}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </Grid>
                    <Grid item xl={4} md={3} sm={2} xs={null}> 

                    </Grid>
                </Grid>
                <Fab onClick={closeModal} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </Box>
        </Modal>
    )
}

export default InternalMessageModal