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
                                    Existirán servicios que no se podrán ver si no hay conexión a internet. La aplicación dará avisos
                                    en los casos que los requiera.
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