import { Box, Button, Fab, Grid, Modal } from "@material-ui/core"
import { Close } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { dateWithTime, getUserNameById, styleInternalMessageModal } from '../../config';
import { useAuth } from "../../context";


const ReportMessagesModal = ({open, close, report}) => {
    const {userData} = useAuth()
    const [ messages, setMessages ] = useState([])

    useEffect(() => {
        report.history.forEach(async (message, i) => {
            if(navigator.onLine) {
                message.name = await getUserNameById(message.userSendingData)
            }else{
                message.name = 'Sin información (fuera de red)'
            }
            if(i == (report.history.length - 1)) {
                setMessages(report.history.sort((a, b) => {
                    return b.id - a.id
                }))
            }
        })
    }, [])
    
    

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
                        <h1>Mensajes a las revisiones de la OT</h1>
                        <div style={{width: '100%', overflowY: 'auto', height: 'calc(100vh - 300px)'}}>
                        {
                            (messages.length == 0) && <p>No hay mensajes</p>
                        }
                        {
                            (messages.length > 0) && messages.map((message, index) => {
                                return(
                                    <div key={index} style={{width: '100%', padding: 10}}>
                                        <div style={{borderRadius: 20, backgroundColor: '#BE2E26', color: '#FFF', padding: 10}}>
                                            <p style={{fontSize: 18}}><strong>{message.name}</strong></p>
                                            <p style={{fontSize: 20, whiteSpace: 'pre'}}>{message.message}</p>
                                            <p style={{fontSize: 12}}>Fecha: {dateWithTime(message.id)}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </Grid>
                    <Grid item xl={4} md={3} sm={2} xs={null}> 

                    </Grid>
                </Grid>
                <Fab onClick={()=>close()} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </Box>
        </Modal>
    )
}

export default ReportMessagesModal
