import { Modal, ListItem, Fab, Switch, Box } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { styleModalActivity } from '../../config';


const ReadActivityModal = ({open, closeModal, activity}) => {

    console.log(activity)

    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleModalActivity}>
                
                <div style={{width: '100%', height: '70vh', overflowY: 'auto'}}>
                    <div style={{width: '100%', borderBottomStyle: 'solid', borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5}}>
                        <h2 style={{marginBottom: 0}}>{activity.strpmdesc}</h2>
                        <p style={{marginTop: 0}}>ID: {activity.secexec} </p>
                    </div>
                    <div>
                        <p> <b>Tarea a realizar</b> </p>
                        <p> {activity.taskdesc} </p>
                    </div>
                    <div>
                        <p> <b>Observaciones</b> </p>
                        <p> {activity.obs01} </p>
                    </div>
                    <div>
                        <p> <b>Equipo responsable</b> </p>
                        <p> {activity.workteam} {activity.workteamdesc} </p>
                    </div>
                </div>
                <Fab onClick={() => closeModal()} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </Box>  
        </Modal>
    )
}

export default ReadActivityModal