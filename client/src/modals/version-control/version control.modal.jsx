import { Modal, ListItem, Fab, Switch, Box } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { styleModal } from '../../config';
import { environment } from '../../config';

const VersionControlModal = ({open, closeModal}) => {

    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleModal}>
                <div style={{textAlign: 'left', width: '100%'}}>
                    <h2>Versión {environment.version}</h2>
                </div>
                <div style={{width: '100%', height: '25vh'}}>
                        <p>
                            Se ha actualizado la aplicación de servicios de Mantenimiento e Inspección.
                        </p>
                        <p>
                                <li>
                                    Los usuarios pueden navegar sin conexión, de acuerdo a sus privilegios. 
                                </li>
                                <li>
                                    Los usuarios que intenten acceder a una URL de la aplicación a la que no cuente con permisos, aparecerá un mensaje indicando que no tiene acceso. 
                                </li>
                                <li>
                                    Se ejecuta lógica offline para máquinas 3D. 
                                </li>
                                <li>
                                    Los administradores pueden asignar obra al crear o editar usuarios. 
                                </li>
                        </p>
                </div>
                <Fab onClick={() => closeModal()} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </Box>  
        </Modal>
    )
}

export default VersionControlModal