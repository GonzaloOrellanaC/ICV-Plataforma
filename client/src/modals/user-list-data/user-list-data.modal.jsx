import { Modal, ListItem, Fab, Switch, Box } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { styleModal } from '../../config';

const UserListDataModal = ({open, userModal, handleChange, checked, permissionsReports, permissionsUsers, closeModal}) => {

    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleModal}>
                <div style={{textAlign: 'left', width: '100%'}}>
                    <h2>Datos del Usuario</h2>
                </div>
                <div style={{width: '100%', height: '25vh'}}>
                    <div style={{float: 'left', width: '30%'}}>
                        <p><strong>Nombre y Apellido</strong></p>
                        <p> {userModal.name} {userModal.lastName} </p>
                        <br />
                        <p><strong>Rol del usuario</strong></p>
                        <p> {userModal.roleTranslated} </p>
                    </div>
                    
                    <div style={{float: 'left', width: '30%'}}>
                        <p><strong>Email</strong></p>
                        <p> {userModal.email}</p>
                        <br />
                        <p><strong>RUN</strong></p>
                        <p> {userModal.rut} </p>
                    </div>
                    
                    <div style={{float: 'right', width: '30%'}}>
                        <ListItem>
                            <Switch onChange={handleChange} checked={checked} ></Switch> <p>Usuario activo</p>
                        </ListItem>
                    </div>
                </div>
                <div style={{width: '100%'}}>
                    <p><strong>Permisos y accesos</strong></p>
                    <div style={{minHeight: '16.5vw', borderRadius: 12, borderWidth: 1, borderStyle: 'solid', borderColor: '#C4C4C4', backgroundColor: '#F1F1F1'}}>
                        <div style={{margin: 10, padding: 10, width: '45%', float: 'left'}}>
                            {
                                permissionsReports && permissionsReports.map((e, i) => {
                                    if(e.isChecked) {
                                        return(
                                            <div>
                                                <p><strong>{e.name}</strong></p>
                                            </div>
                                        )
                                    }
                                })
                            } 
                        </div>
                        <div style={{margin: 10, padding: 10, width: '45%', float: 'right'}}>
                            {
                                permissionsUsers.map((e, i) => {
                                    if(e.isChecked) {
                                        return(
                                            <div>
                                                <p><strong>{e.name}</strong></p>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
                <div style={{width: '100%', height: '5vh', margin: 10}}>
                    <button style={{
                        width: 189, 
                        height: 48, 
                        borderRadius: 23, 
                        fontSize: 20, 
                        color: '#fff',  
                        backgroundColor: '#BB2D2D',
                        borderColor: '#BB2D2D',
                        position: 'absolute',
                        right: 30
                        }}
                        
                        >
                        Editar usuario
                    </button>
                </div>
                <Fab onClick={() => closeModal(userModal)} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </Box>  
        </Modal>
    )
}

export default UserListDataModal