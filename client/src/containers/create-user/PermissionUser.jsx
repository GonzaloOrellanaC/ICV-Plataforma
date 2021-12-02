import { useState, useEffect } from "react";
import { makeStyles, Grid, Box, FormControl, IconButton, Checkbox } from "@material-ui/core";
import { faEyeDropper, faEyeSlash, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useHistory } from 'react-router-dom'
import UserInfo from "./userInfoData";

const useStyles = makeStyles(theme => ({
    inputsStyle: {
        borderColor: '#C4C4C4'
    }
}));

const PermissionUser = ({height}) => {

    const [permisos, setChecked] = useState(UserInfo.permisos);

    const handleChange = (event, i) => {
        let item = permisos[i];
        item.isChecked = event.target.checked;
        setChecked(permisos)
    }

    let age;

    const classes = useStyles()

    const newFunction = () => {

    }
        
    useEffect(() => {

    }, []);

    return (
        <Box>
            <div style={{height: height, width: '100%'}}>
                <Grid style={{height: height, padding: 30, marginLeft: 100, width: '100%'}}>
                    <div style={{marginRight: 10, width: '100%'}}>
                        <div style={{ float: 'left', padding: 20, marginRight: 50, backgroundColor: '#F9F9F9', borderRadius: 20, width: 293}}>
                            <h2>Datos del usuario</h2>

                            <div style={{width: '100%', marginBottom: 15}}>
                                <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>RUT</p>
                                <p style={{margin: 0, fontSize: 16}}>55445544-5</p>
                            </div>

                            <div style={{width: '100%', marginBottom: 15}}>
                                <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Nombre y Apellido</p>
                                <p style={{margin: 0, fontSize: 16}}>Juan Perez</p>
                            </div>

                            <div style={{width: '100%', marginBottom: 15}}>
                                <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Tipo de usuario</p>
                                <p style={{margin: 0, fontSize: 16}}>Técnico Operario</p>
                            </div>

                            <div style={{width: '100%', marginBottom: 15}}>
                                <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Correo electrónico</p>
                                <p style={{margin: 0, fontSize: 16}}>nombre.apellido@correo.com</p>
                            </div>

                            <div style={{width: '100%', marginBottom: 15}}>
                                <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Teléfono</p>
                                <p style={{margin: 0, fontSize: 16}}>+56 9 8756 4123</p>
                            </div>

                            <div style={{width: '100%', marginBottom: 15}}>
                                <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Contraseña</p>
                                <p style={{margin: 0, fontSize: 16}}>xxxxxxxxxxxx <IconButton style={{fontSize: 16, padding: 2}}><FontAwesomeIcon icon={faEyeSlash} /></IconButton> </p>
                            </div>

                            <div style={{width: '100%', marginBottom: 15}}>
                                {/* <Link>
                                    <a>Modificar datos</a>
                                </Link> */}
                            </div>
                        </div>

                        <div style={{float: 'left', paddingLeft: 50, height: '100%', width: '60%', borderLeftColor: '#C4C4C4', borderLeftWidth: 1, borderLeftStyle: 'solid'}}>
                            <div style={{ padding: 20, width: '100%'}}>
                                <h2>Admininstrar permisos</h2>

                                <div style={{float: 'left', width: '45%'}}>
                                    {
                                        permisos.slice(0, 8).map((e, i) => {
                                            return(
                                                <div key={i}>
                                                    <Checkbox
                                                        edge="start"
                                                        onChange={(event) => handleChange(event, i)}
                                                    />
                                                    <label> {e.label} </label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div style={{float: 'left', width: '45%'}}>
                                    {
                                        permisos.slice(9, 16).map((e, i) => {
                                            return(
                                                <div key={i}>
                                                    <Checkbox
                                                        edge="start"
                                                        onChange={(event) => handleChange(event, i)}
                                                    />
                                                    <label> {e.label} </label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
            </div>
        </Box>
    )
}

export default PermissionUser