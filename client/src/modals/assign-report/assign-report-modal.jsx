import { useState, useEffect } from 'react';
import { 
    Box, 
    Modal,
    Toolbar,
    Fab,

} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { styleModal } from '../../config';

const AssignReportModal = ({open, report, closeModal}) => {
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
                
                
                
                <Toolbar style={{width: '100%', height: 59, paddingLeft: 0}}>
                    <h2>Asignar Pauta de {reportType} {guide}</h2>
                    
                    
                    <div style={{ position: 'absolute', right: 65 , backgroundColor: colorState, paddingTop: 3, borderRadius: 5, width: 100, height: 20, textAlign: 'center'}}>
                        <p style={{margin: 0, fontSize: 12}}>{state.toUpperCase()}</p>
                    </div>
                </Toolbar>
                <div style={{width: '100%', height: 90}}>
                    <div style={{width: 'calc(100%/3)', float: 'left', display: 'block', margin: 0}}>
                        <strong>Faena:</strong> <br />
                        Nombre Faena
                    </div>
                    <div style={{width: 'calc(100%/3)', float: 'left'}}>
                        <strong>Sector:</strong> <br />
                        Nombre del sector
                    </div>
                    <div style={{width: 'calc(100%/3)', float: 'left'}}>
                        <strong>Número de orden:</strong> <br />
                        {idIndex}
                    </div>

                </div>
                <div style={{width: '100%', height: 59}}>
                    <div style={{width: 'calc(100%/3)', float: 'left', display: 'block', margin: 0}}>
                        <strong>Pauta:</strong> <br />
                        {guide}
                    </div>
                    <div style={{width: 'calc(100%/3)', float: 'left'}}>
                        <strong>Acciones:</strong> <br />
                        
                    </div>


                </div>
                <div style={{width: '100%', height: 59}}>
                <label>Reasignar Pauta a:</label>
                <br />
                <select placeholder="Seleccionar operario" style={{height: 44, width: 274, borderStyle: 'solid', borderColor: '#C4C4C4', borderWidth: 1, borderRadius: 10}}>
                    <option value="">Seleccionar operario</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select>


                </div>

                <Fab onClick={closeModal} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
                
            </Box>
        </Modal>
    )
}

export default AssignReportModal