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
                <div style={{width: '100%', height: '25vh', overflowY: 'auto'}}>
                    <p>
                        Se ha actualizado la aplicación de servicios de Mantenimiento e Inspección.
                    </p>
                    <p>
                        <strong>v.3.2</strong>
                        <li>
                            Se habilitan reportes. Se realizan para pruebas:
                            <ul>
                                <li>
                                    Creación
                                </li>
                                <li>
                                    Edición
                                </li>
                                <li>
                                    Asignación por usuario Operario de Inspección y Operario de Mantención
                                </li>
                                <li>
                                    Pautas solo se pueden ver para pruebas. No se ha habilitado para ser ejecutadas y guardadas.
                                </li>
                            </ul>
                        </li>
                    </p>
                    <p>
                        <strong>v.2.9.4</strong>
                        <li>
                            Reparaciones en servicio de reset de contraseña.
                        </li>
                    </p>
                    <p>
                        <strong>v.2.9.3</strong>
                        <li>
                            Formulario de creación de usuarios con modificaciones. Se generan alertas y bordes rojos en inputs para identificar el estado del formulario.
                        </li>
                    </p>
                    <p>
                        <strong>v.2.9.2</strong>
                        <li>
                            Se corrige error de requerimiento obligado para obtener lista de todas las máquinas de las obras.
                        </li>
                    </p>
                    <p>
                        <strong>v.2.9.1</strong>
                        <li>
                            Se habilita color burdeo en navegación por barra lateral.
                        </li>
                        <li>
                            Se corrige problemas de acceso a áreas no permitidas, a pesar de contar con privilegios.
                        </li>
                    </p>
                    <p>
                        <strong>v.2.9</strong>
                        <li>
                            Se habilita restablecimiento de contraseña.
                        </li>
                        <li>
                            Se agregan imágenes en formatos SVG, JPG y PNG con mayor resolución.
                        </li>
                    </p>
                    <p>
                        <strong>v.2.5</strong>
                        <li>
                            Se actualiza para responsividad smartphone, excepto control de usuarios usando admin o Ejecutivo SAP y reportes.
                        </li>
                        <li>
                            Se corrige error de redacción de correo electrónico. 
                        </li>
                    </p>
                    <p>
                        <strong>v.2.2</strong>
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