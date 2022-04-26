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
                        <p>Se ha actualizado la aplicación de servicios de Mantenimiento e Inspección.</p>
                        <strong>v.1.1</strong>
                        <li>
                            Se agrega listado de OTs asignadas a cada máquina.
                        </li>
                        <li>
                            Se ajustan cambios en pautas.
                        </li>
                        <br />
                        <strong>v.1.0</strong>
                        <li>
                            Habilitado producción.
                        </li>
                        {/* <strong>v.6.8</strong>
                        <li>
                            (En ejecución) Reparación de PDF.
                        </li>
                        <li>
                            Corrección de errores notificaciones.
                        </li>
                        <strong>v.6.5</strong>
                        <li>
                            (En ejecución) Reparación de PDF.
                        </li>
                        <li>
                            Corrección de errores.
                        </li>
                        <strong>v.6.4</strong>
                        <li>
                            (En ejecución) Reparación de PDF.
                        </li>
                        <li>
                            Se agregan botones para mostrar password.
                        </li>
                        <li>
                            Se repara aviso de creación de usuario, el cual no aparecía, dejando el 
                            spinner girando de manera infinita a menos que se recargue la página.
                        </li>
                        <strong>v.6.3</strong>
                        <li>
                            (En ejecución) Reparación de PDF.
                        </li>
                        <strong>v.6.2</strong>
                        <li>
                            Reparaciones menores.
                        </li>
                        <li>
                            Se elimina necesidad de volver a descargar modelos 3D.
                        </li>
                        <strong>v.6.1</strong>
                        <li>
                            Se agrega firma digital.
                        </li>
                        <strong>v.6.0</strong>
                        <li>
                            Reparaciones de sistema.
                        </li>
                        <strong>v.5.9</strong>
                        <li>
                            Etiquetado de modelos 3D.
                        </li>
                        <li>
                            PDF de prueba de Orden de Trabajo terminado.
                        </li>
                        <li>
                            Reparación de errores en recuperación de password.
                        </li>

                        <strong>v.5.8</strong>
                        <li>
                            Desde correo electrónico puede seguir vía link el flujo de aprobaciones de las Ordenes de Trabajo.
                        </li>

                        <strong>v.5.7</strong>
                        <li>
                            Envío de mensajes para feedback a administración de plataforma.
                            Nueva vista de perfil y edición de fotografía por el usuario.
                            Queda pendiente la edición de los datos.
                        </li>

                        <strong>v.5.6</strong>
                        <li>
                            Gestión de usuarios. Se permite adjuntar una foto una vez creado el usuario.
                            Se agrega vista de camión blanca como imágen principal de modelos 3D.
                        </li>

                        <strong>v.5.5</strong>
                        <li>
                            Conexión a API Inspecciones y sistema de aviso y reasignación de Ordenes para cambios de turno.
                        </li>
                        <strong>v.5.0</strong>
                        <li>
                            Ejecución de ordenes de trabajo con flujo siguiente:
                            
                            Creación de orden por parte de ejecutivo SAP. <br/>
                            | <br/>
                            -- Ejecución y cierre por parte de Operador de Mantención, <br/>
                                | <br/>
                                -- Una vez cerrada la orden por parte de Operador de Mantención, lo puede editar Jefe de Turno, <br/>
                                    | <br/>
                                    -- Cerrado por Jefe de Turno, lo puede editar Jefe de Maquinaria. <br/>
                                        | <br/>
                                        -- Cerrado por Jefe de Maquinaria lo puede editar Ejecutivo SAP. <br/>
                                            | <br/>
                                            -- Ejecutivo SAP cierra el flujo. <br/>

                            * Pendiente reasignación de usuario para cambio de turno y agregar conexión a API de Inspecciones.
                            * Queda pendiente tambien la edición de las ordenes. Solo se pueden crear.
                        </li>

                        <strong>v.4.0</strong>
                        <li>
                            Descarga y vista mediante menú de equipos y partes de las máquinas en 3D.
                        </li>

                        <strong>v.3.5</strong>
                        <li>
                            Pruebas de reparación IA.
                        </li>

                        <strong>v.3.4</strong>
                        <li>
                            Se incorpora botón Inteligencia Artificial en navegador para ingresar fotos de las máquinas, para que el sistema identifique sus partes más importantes.
                        </li>
                        <li>
                            Se habilita llenado <strong>solo online</strong> de los reportes a Operarios de Inspección y Operarios de Mantención.
                        </li>
                    
                        <strong>v.3.3</strong>
                        <li>
                            Se habilita nuevo botón en navegador lateral "Listado Asignaciones" para operarios
                        </li>
                        <li>
                            Indicador de conexión a internet en Header, Parte superior, dereha. Tiempo máximo de espera de aviso una vez desconactado de la red: 10 segundos.
                        </li>
                    
                    
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
                    
                    
                        <strong>v.2.9.4</strong>
                        <li>
                            Reparaciones en servicio de reset de contraseña.
                        </li>
                    
                    
                        <strong>v.2.9.3</strong>
                        <li>
                            Formulario de creación de usuarios con modificaciones. Se generan alertas y bordes rojos en inputs para identificar el estado del formulario.
                        </li>
                    
                    
                        <strong>v.2.9.2</strong>
                        <li>
                            Se corrige error de requerimiento obligado para obtener lista de todas las máquinas de las obras.
                        </li>
                    
                    
                        <strong>v.2.9.1</strong>
                        <li>
                            Se habilita color burdeo en navegación por barra lateral.
                        </li>
                        <li>
                            Se corrige problemas de acceso a áreas no permitidas, a pesar de contar con privilegios.
                        </li>
                    
                    
                        <strong>v.2.9</strong>
                        <li>
                            Se habilita restablecimiento de contraseña.
                        </li>
                        <li>
                            Se agregan imágenes en formatos SVG, JPG y PNG con mayor resolución.
                        </li>
                    
                        <strong>v.2.5</strong>
                        <li>
                            Se actualiza para responsividad smartphone, excepto control de usuarios usando admin o Ejecutivo SAP y reportes.
                        </li>
                        <li>
                            Se corrige error de redacción de correo electrónico. 
                        </li>
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
                        </li> */}
                </div>
                <Fab onClick={() => closeModal()} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </Box>  
        </Modal>
    )
}

export default VersionControlModal