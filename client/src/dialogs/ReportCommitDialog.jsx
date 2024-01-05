import { useState, useEffect } from 'react';
import { 
    Fab,
    TextareaAutosize,
    Grid,
    Button,
    Dialog,

} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAuth } from '../context';

const ReportCommitDialog = ({open, report, closeModal, isTermJornada, terminarjornada, messageType}) => {
    const {userData} = useAuth()
    const [ message, setMessage ] = useState('')
    useEffect(() => {
        console.log(report)
    },[report])
    const sendMessage = () => {
        if(message.length > 1) {
            const navigateType = isTermJornada ? 'reject-for-end-day' : (messageType==='rejectReport' ? 'reject-to-previous-level' : 'sending-to-next-level')
            report.history.push({
                id: Date.now(),
                userSendingData: userData._id,
                type: navigateType,
                message: message
            })
            if (isTermJornada) {
                terminarjornada()
            } else {
                closeModal(true)
            }
        }else{
            alert('Por favor deje un comentario a la actividad.')
        }
        
    }

    const removeMessage = () => {
        setMessage('');
    }

    const closeModalActivate = () => {
        closeModal(false);
    }
    
    
    return(
        <Dialog
            open={open}
        >
            <div style={{padding: 30, width: 600}}>
                <Grid container style={{padding: 10}}>
                    <div style={{width: '100%'}}>
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
                <Fab onClick={()=>closeModalActivate()} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </div>
        </Dialog>
    )
}

export default ReportCommitDialog