import { useState, useEffect } from 'react';
import { 
    Box, 
    Modal,
    Toolbar,
    Fab,

} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { styleModal } from '../../config';

const Alert = ({open, report, closeModal}) => {
    const [ operarios, setOperarios ] = useState([]);
    const [ colorState, setColorState ] = useState();
    const { reportType, idIndex, guide, state } = report;

    useEffect(() => {
        if(state === 'Por asignar') {
            setColorState('#E99797');
        }else if(state === 'En proceso') {
            setColorState('#F5C69C');
        }   
    }, [])
    
    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleModal}>
                <div style={{textAlign: 'center'}}>
                    <img src="../../assets/icons/check-green.svg" alt="" />
                    {(routingData === 'Nuevo usuario') &&
                        <h1>Usuario creado con éxito</h1>}
                    {(routingData === 'Editar usuario') &&
                        <h1>Usuario editado con éxito</h1>}
                </div>
                <Fab onClick={openCloseModal} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </Box>
        </Modal>
    )
}

export default AssignReportModal