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
import { styleInternalMessageModal } from '../../config';

const ReportCommitModal = ({open, report, closeModal, closeLoading, getResponseState, messageType}) => {
    const [ message, setMessage ] = useState('');

    useEffect(() => {
        
    }, []);

    const sendMessage = () => {
        if(message.length > 1) {
            const historyType = messageType==='rejectReport' ? 'reject-to-previous-level' : 'sending-to-next-level'
            /* if(messageType === 'rejectReport') {
                historyType = 'reject-to-previous-level'
            } else if (messageType === 'sendReport') {
                historyType = 'sending-to-next-level'
            } */
            report.history.push({
                id: Date.now(),
                userSendingData: localStorage.getItem('_id'),
                type: historyType,
                message: message
            })
            closeModal();
            getResponseState(true, report)
        }else{
            alert('Por favor deje un comentario a la actividad.')
        }
        
    }

    const removeMessage = () => {
        setMessage('');
    }

    const closeModalActivate = () => {
        closeModal();
        closeLoading();
        getResponseState(false, report)
    }
    
    
    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            //onClose={()=>getResponseState()}
        >
            <Box sx={styleInternalMessageModal}>
                <Grid container style={{paddingTop: 50}}>
                    <Grid item xl={4} md={3} sm={2} xs={null}> 

                    </Grid>
                    <Grid item xl={4} md={6} sm={8} xs={12}>
                    <div>
                        <h1>Deje un comentario.</h1>
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
                <Fab onClick={()=>closeModalActivate()} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </Box>
        </Modal>
    )
}

export default ReportCommitModal