import { Modal, Fab, Box } from '@mui/material'
import { Close, Undo } from '@mui/icons-material'
import { environment, styleModal } from '../../config'

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
                    <li>
                        Se corrige error al enviar término de jornada.  
                    </li>
                </div>
                <div style={{width: '100%', height: '25vh', overflowY: 'auto'}}>
                    <br />
                    <strong>v2.9.3</strong>
                    <li>
                        Se deshabilita actualización de app por medio de vertical scrolling.  
                    </li>
                    <br />
                    <strong>v2.9.2</strong>
                    <li>
                        Se corrige error de asignación de usuarios y botón de sincronización.  
                    </li>
                    <br />
                    <strong>v2.9.1</strong>
                    <li>
                        Corrección de errores  
                    </li>
                    <br />
                    <strong>v2.9</strong>
                    <li>
                        Se mejora el rendimiento y repara errores de bugs producto de  
                    </li>
                    <br />
                    <strong>v2.6.4</strong>
                    <li>
                        Cambios en Pautas. Ahora se pueden eliminar comentarios, fotos y el estado de ticket verde o amarillo a vacío en caso de error. 
                    </li>
                    <li>
                        Se aplican filtros en OT de maquinaria. 
                    </li>
                    <li>
                        Otras modificaciones menores. 
                    </li>
                    <br />
                    <strong>v2.6.3</strong>
                    <li>
                        Se permite el borrado de mensajes a usuarios que crean los mensajes o Admins 
                    </li>
                    <li>
                        Se agrega nueva vista de resumen de insumos o materiales, para ejecutivos SAP o Administradores 
                    </li>
                    <strong>v2.6.2</strong>
                    <li>
                        Reparación visualización de pautas 
                    </li>
                    <li>
                        Se agrega en opciones un botón para ver las pautas descargadas en el dispositivo 
                    </li>
                    <br />
                    <strong>v2.6.1</strong>
                    <li>
                        Se genera vista previa de la OT para Ejecutivo SAP y los administradores 
                    </li>
                    <li>
                        Se crea botón de eliminación de mensajes de tareas para OTs 
                    </li>
                    <br />
                    <strong>v2.6</strong>
                    <li>
                        Reparación errore de carga de datos
                    </li>
                    <br />
                    <strong>v2.5.5</strong>
                    <li>
                        Nueva máquina Bulldozer Caterpillar D10-T2
                    </li>
                    <br />
                    <strong>v.2.5</strong>
                    <li>
                        Nuevas Obras y Nuevas máquinas.
                    </li>
                    <br />
                    <strong>v.2.3.1</strong>
                    <li>
                        Reparaciones menores en lista de Ordenes
                    </li>
                    <br />
                    <strong>v.2.3.1</strong>
                    <li>
                        Error de login con R.U.N. resuelto
                    </li>
                    <br />
                    <strong>v.2.3</strong>
                    <br />
                    <strong>Documentos PDF</strong>
                    <li>
                        Se agrega Nro de Pauta en título de la OT
                    </li>
                    <li>
                        Se agrega ID de Documento
                    </li>
                    <li>
                        Se corrige nombre de la pauta al descargar
                    </li>
                    <strong>Página Ordenes</strong>
                    <li>
                        Se agrega primeros filtros (ordenar por OT y ordenar por Nro de Máquina)
                    </li>
                    <li>
                        Se puede corregir número SAP desde ventana emergente al presionar votón <button style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Ver</button>
                    </li>
                    <strong>Máquinas</strong>
                    <li>
                        Al ingresar a cada máquina, en el listado de las OT, puede ver un <a href='#'>Enlace Documento</a> en caso de existir documento PDF creado.
                    </li>
                    <strong>Login</strong>
                    <li>
                        Login por defecto queda por R.U.N.
                    </li>
                    <br />
                    <strong>v.2.2.1</strong>
                    <li>
                        Reparación de errores generados en versión 2.2
                    </li>
                    <strong>v.2.2</strong>
                    <li>
                        Se habilita multiusuarios.
                    </li>
                    <strong>v.2.1</strong>
                    <li>
                        Corrección de errores al cierre de OT.
                    </li>
                    <li>
                        Todo usuario que no sea operario, obtendrá la pauta desde la base de datos. Con esto se espera que se elimine la información.
                    </li>
                    <p>Se ha actualizado la aplicación de servicios de Mantenimiento e Inspección.</p>
                    <strong>v.2.0</strong>
                    <li>
                        Se agrega al servicio sistema de búsqueda por Nombre, Rut y Correo Electrónico
                    </li>
                    <li>
                        Se elimina la posibilidad al Jefe de Maquinaria la posibilidad de comentar.
                    </li>
                    <li>
                        Se agrega al servicio restaurador de datos de ejecución de OT desde la cuenta
                        de Operador o Mantenedor, utilizando botón <strong>Restaurar</strong>.
                    </li>
                    <div
                        style={
                            {
                                width: '100%',
                                textAlign: 'center'
                            }
                        }
                    >
                        <Fab color="primary" aria-label="add">
                            <Undo />
                        </Fab>
                    </div>
                    <div
                        style={
                            {
                                borderBottomWidth: 1,
                                borderBottomStyle: 'solid',
                                borderBottomColor: '#ccc',
                                paddingTop: 0,
                                marginBottom: 50
                            }
                        }
                    >

                    </div>
                    <strong>v.1.9.9</strong>
                    <li>
                        Modificaciones en vistas de Ordenes.
                    </li>
                    <li>
                        Se habilita vista de Ordenes para Jefe de Maquinaria. Este perfil no puede generar nuevo documento PDF por estar
                        fuera del flujo de actualizaciones de la OT.
                    </li>
                    <strong>v.1.9.8</strong>
                    <li>
                        Reparación de fallos al subir las AST.
                    </li>
                    <strong>v.1.9.7</strong>
                    <li>
                        Reparación de fallos PDF.
                    </li>
                    <strong>v.1.9.6</strong>
                    <li>
                        Inserta imágenes de comentarios en PDF.
                    </li>
                    <strong>v.1.9.5</strong>
                    <li>
                        Cambios en la generación del documento PDF. Ahora se crea automáticamente al cerrar la OT por parte del Ejecutivo SAP, Admin o Super Admin.
                    </li>
                    <li>
                        Listado de OTs en página Ordenes, ordenados por Nro OT.
                    </li>
                    <strong>v.1.9</strong>
                    <li>
                        Se integra servicio Storage para imágenes de la plataforma.
                    </li>
                    <strong>v.1.8.9</strong>
                    <li>
                        Cambios en forma de llenado de pauta, presionando el checkbox.
                    </li>
                    <li>
                        Mejoras de rendimiento.
                    </li>
                    <strong>v.1.8.8</strong>
                    <li>
                        Reparación de notificaciones.
                    </li>
                    <li>
                        Vista notificaciones de página de inicio se actualiza junto a la llegada de notificaciones push.
                    </li>
                    <strong>v.1.8.7</strong>
                    <li>
                        Cambios en los permisos de roles.
                    </li>
                    <li>
                        Correo para creación de usuarios opcional.
                    </li>
                    <strong>v.1.8.6</strong>
                    <li>
                        Se agrega login usando RUT.
                    </li>
                    <li>
                        Reparaciónes menores.
                    </li>
                    <strong>v.1.8.5</strong>
                    <li>
                        Reparaciones menores.
                    </li>
                    <strong>v.1.8</strong>
                    <li>
                        Modelo 3D de subsistema desde la OT.
                    </li>
                    <li>
                        Etiquetado de Pala y Camión.
                    </li>
                    <strong>v.1.7</strong>
                    <li>
                        Se posicionan etiquetas de Pala y Camión de acuerdo a indicaciones.
                    </li>
                    <strong>v.1.6</strong>
                    <li>
                        Se habilita vista 3D de máquinas. Solo cambión Caterpillar 793-F cuenta con etiquetas en las partes.
                    </li>
                    <li>
                        Se habilita botón de borrado del sistema en caso de requerir limpiar la memoria.
                    </li>
                    <strong>v.1.5</strong>
                    <li>
                        Se agrega elemento que permite borrar o cambiar la AST.
                    </li>
                    <strong>v.1.4</strong>
                    <li>
                        Optimizaciones. Cambios al proceso de flujo. Se corrige error al enviar OT finalizando sin conexión.
                    </li>
                    <strong>v.1.3</strong>
                    <li>
                        Ajustes de usuarios. Corrección en caso de cambios para la AST.
                    </li>
                    <li>
                        Corrección de errores.
                    </li>
                    <strong>v.1.2</strong>
                    <li>
                        Cambios de vistas. Se agrega foto AST en pautas.
                    </li>
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