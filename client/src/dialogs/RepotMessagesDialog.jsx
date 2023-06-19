import { Box, Button, Dialog, Fab, Grid, Modal } from "@material-ui/core"
import { Close } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { dateWithTime, getUserNameById, styleInternalMessageModal } from '../config';
import { useAuth } from "../context";

const ReportMessagesDialog = ({open, close, report}) => {
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
        <Dialog
            open={open}
            maxWidth={'xl'}
            adaptiveHeight={true}
        >
            <div style={{ width: 800, padding: 10}} >
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
                                        <p style={{fontSize: 20}}>{message.message}</p>
                                        <p style={{fontSize: 12}}>Fecha: {dateWithTime(message.id)}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <Fab onClick={()=>close()} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </div>
        </Dialog>
    )
}

export default ReportMessagesDialog
