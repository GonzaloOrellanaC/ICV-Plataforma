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

const ReportCommitModal = ({open, report, closeModal, getResponseState}) => {
    const [ message, setMessage ] = useState('');

    useEffect(() => {
        
    }, []);

    const sendMessage = () => {
        if(message.length > 1) {
            if(!report.level || report.level == 0) {
                //report.shiftManagerApprovedCommit = message;
            }else if(report.level == 1) {
                report.shiftManagerApprovedCommit = message;
            }else if(report.level == 2) {
                report.chiefMachineryApprovedCommit = message;
            }else if(report.level == 3) {
                report.sapExecutiveApprovedCommit = message;
            };
            //console.log(report.shiftManagerApprovedCommit)
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
                        <h1>Comentarios de la revisión.</h1>
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