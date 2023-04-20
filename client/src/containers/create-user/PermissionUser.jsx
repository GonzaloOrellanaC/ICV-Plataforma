import { useState, useEffect } from "react";
import { makeStyles, Grid, Box, FormControl, IconButton, Checkbox } from "@material-ui/core";
import { faEyeDropper, faEyeSlash, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useHistory } from 'react-router-dom'
import UserInfo from "./userInfoData";
import { permisosRoutes } from "../../routes";
import { changeTypeUser } from '../../config'

const useStyles = makeStyles(theme => ({
    inputsStyle: {
        borderColor: '#C4C4C4'
    }
}));

const PermissionUser = ({width, height, typeDisplay, id}) => {

    const [ userData, setUserData ] = useState()
    /* const [ userType, setUserType ] = useState(''); */
    /* const [ obra, setObra ] = useState('') */
    const [ permisosReportes, setPermisosReportes ] = useState([]);
    const [ permisosUsuarios, setPermisosUsuarios ] = useState([]);

    useEffect(() => {
        setUserData(JSON.parse(localStorage.getItem('userDataToSave')))
        /* setObra(JSON.parse(JSON.parse(localStorage.getItem('userDataToSave')).sites).descripcion) */
        /* getPermisos(); */
        /* renameUserType(); */
    }, []);

    /* SELECCION DE CHECKBOX */
    
    const handleChange = (checked, i, list, nameList) => {
        list[i].isChecked = checked;
        setPermisosReportes([]);
        setPermisosUsuarios([]);
        if(nameList === 'reportes') {
            setPermisosReportes(list);
            localStorage.setItem('listaPermisosReportes', JSON.stringify(permisosReportes))
            setTimeout(() => {
                setPermisosUsuarios(permisosUsuarios);
            }, 5);
        }else if(nameList === 'usuarios') {
            setTimeout(() => {
                setPermisosReportes(permisosReportes);
            }, 5);
            localStorage.setItem('listaPermisosUsuarios', JSON.stringify(permisosUsuarios))
            setPermisosUsuarios(list);
        }
    }

    /* OBTENER PERMISOS DESDE BASE DE DATOS */

    const getPermisos = async () => {
        if(typeDisplay === 'Nuevo usuario') {
            const responseData = await permisosRoutes.getPermisos();
            return new Promise(resolve => {
                responseData.data.forEach((responseType, index) => {
                    if(responseType.name === 'reportes') {
                        setPermisosReportes(responseType.resources)
                    }else if(responseType.name === 'usuarios') {
                        setPermisosUsuarios(responseType.resources)
                    }
                    if(index == (responseData.data.length - 1)) {
                        resolve(true)
                    }
                })
            })
        }else if(typeDisplay === 'Editar usuario') {
            const responseData = await permisosRoutes.getPermisosByUser(id);
            return new Promise(resolve => {
                Object.keys(responseData.data).map((e, i) => {
                    if(e === 'permissionsReports') {
                        setPermisosReportes(responseData.data[e])
                    }else if(e === 'permissionsUsers') {
                        setPermisosUsuarios(responseData.data[e])
                    }
                    if(i == (Object.keys(responseData.data).length - 1)) {
                        resolve(true)
                    }
                })
            })
        }
    }

    /* EN BASE DE DATOS SE GUARDA NOMBRE, EL CUAL DEBE MOSTRARSE SEGÚN ROL */

/*     const renameUserType = async () => {
        let userDataRole = await changeTypeUser(JSON.parse(localStorage.getItem('userDataToSave')).role);
        setUserType(userDataRole);
    } */

    const classes = useStyles()

    return (
            <Grid container style={{height: height}}>
                {/* <Grid item style={{marginLeft: 100, width: '100%'}}> */}
                    {/* <div style={{marginRight: 10, width: '100%'}}> */}
                        {
                            userData &&
                            <Grid item xl={12} md={12} style={{ padding: 20, marginRight: 0, backgroundColor: '#F9F9F9', borderRadius: 20, overflowY: 'auto'}}>
                                <div style={{textAlign: 'center'}}>
                                    <h2>Resumen del usuario</h2>

                                    <div style={{width: '100%', marginBottom: 15}}>
                                        <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>RUT</p>
                                        <p style={{margin: 0, fontSize: 16}}>{userData.rut}</p>
                                    </div>

                                    <div style={{width: '100%', marginBottom: 15}}>
                                        <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Nombre y Apellido</p>
                                        <p style={{margin: 0, fontSize: 16}}>{userData.name} {userData.lastName}</p>
                                    </div>

                                    <div style={{width: '100%', marginBottom: 15}}>
                                        <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Tipo de usuario</p>
                                        {
                                            userData.roles.map(el => {
                                                return (
                                                    <p>{changeTypeUser(el)}</p>
                                                )
                                            })
                                        }
                                        {/* {
                                            (userData.role.length > 0) ?
                                            <p style={{margin: 0, fontSize: 16}}>{changeTypeUser(userData.role)}</p>
                                            :
                                            userData.roles.map(el => {
                                                return (
                                                    <p>{changeTypeUser(el)}</p>
                                                )
                                            })
                                        } */}
                                    </div>

                                    <div style={{width: '100%', marginBottom: 15}}>
                                        <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Obra</p>
                                        <p style={{margin: 0, fontSize: 16}}>{/* obra */}</p>
                                    </div>

                                    <div style={{width: '100%', marginBottom: 15}}>
                                        <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Correo electrónico</p>
                                        <p style={{margin: 0, fontSize: 16}}>{userData.email}</p>
                                    </div>

                                    <div style={{width: '100%', marginBottom: 15}}>
                                        <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Teléfono</p>
                                        <p style={{margin: 0, fontSize: 16}}>+56 {userData.phone}</p>
                                    </div>

                                    { (typeDisplay === 'Nuevo usuario') && <div style={{width: '100%', marginBottom: 15}}>
                                        <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Contraseña</p>
                                        <p style={{margin: 0, fontSize: 16}}>{userData.password} {/* <IconButton style={{fontSize: 16, padding: 2}}><FontAwesomeIcon icon={faEyeSlash} /></IconButton> */} </p>
                                    </div>}
                                </div>
                            </Grid>
                        }
                        {/* <Grid item  xl={9} md={8} style={{paddingLeft: 20, height: '100%', borderLeftColor: '#C4C4C4', borderLeftWidth: 1, borderLeftStyle: 'solid'}}>
                            <div style={{ padding: 20, width: '100%'}}>
                                <h2>Admininstrar permisos</h2>
                                <div style={{float: 'left', width: '45%'}}>
                                    {
                                        permisosReportes.map((e, i, lista) => {
                                            if(typeDisplay === 'Nuevo usuario') {
                                                if(JSON.parse(localStorage.getItem('userDataToSave')).role === 'sapExecutive'){
                                                    e.isChecked = true
                                                }else if(JSON.parse(localStorage.getItem('userDataToSave')).role === 'inspectionWorker'){
                                                    if(i == 1) {
                                                        e.isChecked = true
                                                    }
                                                }else if(JSON.parse(localStorage.getItem('userDataToSave')).role === 'maintenceOperator'){
                                                    if(i == 1) {
                                                        e.isChecked = true
                                                    }
                                                }else if(JSON.parse(localStorage.getItem('userDataToSave')).role === 'shiftManager'){
                                                    if(i == 1 || i == 2 || i==3 || i == 4) {
                                                        e.isChecked = true
                                                    }
                                                }else if(JSON.parse(localStorage.getItem('userDataToSave')).role === 'chiefMachinery'){
                                                    if(i == 1 || i == 2 || i==3 || i == 4) {
                                                        e.isChecked = true
                                                    }
                                                }
                                            }else if(typeDisplay === 'Editar usuario') {
                                                
                                            }
                                            if(i==(permisosReportes.length - 1)) {
                                                localStorage.setItem('listaPermisosReportes', JSON.stringify(lista))
                                            }
                                            return(
                                                <div key={i}>
                                                    {
                                                        (typeDisplay === 'Nuevo usuario') && <Checkbox
                                                            edge="start"
                                                            checked={e.isChecked}
                                                            onChange={(event) => handleChange(event.target.checked, i, lista, 'reportes')}
                                                        />
                                                    }
                                                    
                                                    {
                                                        (typeDisplay === 'Editar usuario') && <Checkbox
                                                            edge="start"
                                                            checked={e.isChecked}
                                                            onChange={(event) => handleChange(event.target.checked, i, lista, 'reportes')}
                                                        />
                                                    }
                                                    <label> {e.name} </label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div style={{float: 'left', width: '45%'}}>
                                    {
                                        permisosUsuarios.map((e, i) => {
                                            if(typeDisplay === 'Nuevo usuario') {
                                                if(JSON.parse(localStorage.getItem('userDataToSave')).role === 'sapExecutive'){
                                                    e.isChecked = true
                                                }else if(JSON.parse(localStorage.getItem('userDataToSave')).role === 'inspectionWorker'){
                                                    if(i == 1) {
                                                        e.isChecked = true
                                                    }
                                                }else if(JSON.parse(localStorage.getItem('userDataToSave')).role === 'maintenceOperator'){
                                                    if(i == 1) {
                                                        e.isChecked = true
                                                    }
                                                }else if(JSON.parse(localStorage.getItem('userDataToSave')).role === 'shiftManager'){
                                                    if(i == 1 || i == 2 ) {
                                                        e.isChecked = true
                                                    }
                                                }else if(JSON.parse(localStorage.getItem('userDataToSave')).role === 'chiefMachinery'){
                                                    if(i == 1 || i == 2) {
                                                        e.isChecked = true
                                                    }
                                                }
                                            }
                                            if(i==(permisosUsuarios.length - 1)) {
                                                localStorage.setItem('listaPermisosUsuarios', JSON.stringify(permisosUsuarios))
                                            }
                                            return(
                                                <div key={i}>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={e.isChecked}
                                                        onChange={
                                                            (event) => handleChange(event.target.checked, i, permisosUsuarios, 'usuarios')
                                                        }
                                                    />
                                                    <label> {e.name} </label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </Grid> */}
                    {/* </div> */}
                {/* </Grid> */}
            </Grid>
    )
}

export default PermissionUser