import { useState, useEffect, useContext } from "react";
import { makeStyles, Grid, Box, FormControl, IconButton, Checkbox } from "@material-ui/core";
import { faEyeDropper, faEyeSlash, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useHistory } from 'react-router-dom'
import UserInfo from "./userInfoData";
import { permisosRoutes } from "../../routes";
import { changeTypeUser } from '../../config'
import { CreateUserContext } from "../../context";

/* const useStyles = makeStyles(theme => ({
    inputsStyle: {
        borderColor: '#C4C4C4'
    }
})); */

const PermissionUser = ({width, height, typeDisplay, id}) => {

    const {userData, setUserData} = useContext(CreateUserContext)
    const [ permisosReportes, setPermisosReportes ] = useState([]);
    const [ permisosUsuarios, setPermisosUsuarios ] = useState([]);

    /* SELECCION DE CHECKBOX */
    
    /* const handleChange = (checked, i, list, nameList) => {
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
    } */

    /* OBTENER PERMISOS DESDE BASE DE DATOS */

    /* const getPermisos = async () => {
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
    } */

    /* EN BASE DE DATOS SE GUARDA NOMBRE, EL CUAL DEBE MOSTRARSE SEGÚN ROL */

/*     const renameUserType = async () => {
        let userDataRole = await changeTypeUser(JSON.parse(localStorage.getItem('userDataToSave')).role);
        setUserType(userDataRole);
    } */

    /* const classes = useStyles() */

    return (
            <Grid container style={{height: height}}>
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
            </Grid>
    )
}

export default PermissionUser