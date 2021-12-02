import { useState, useEffect } from "react";
import { makeStyles, Grid, Box, FormControl, IconButton } from "@material-ui/core";
import { faEye, faEyeSlash, faPaperclip, faUserCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const useStyles = makeStyles(theme => ({
    inputsStyle: {
        borderColor: '#C4C4C4'
    }
}));

const CreateUser = ({height}) => {

    const [ tiposUsuarios, setTiposUsuarios ] = useState([]);
    const [ verPassword, setVerPassword ] = useState('password');
    const [ verConfirmarPassword, setVerConfirmarPassword ] = useState('password');

    const usersTypes = [
        {
            id: 0,
            name: 'Elija uno...'
        },
        {
            id: 1,
            name: 'Ejecutivo SAP'
        },
        {
            id: 2,
            name: 'Operario de Inspección'
        },
        {
            id: 3,
            name: 'Operario de Mantención'
        },
        {
            id: 4,
            name: 'Jefe de turno - Inspección y Mantención'
        },
        {
            id: 5,
            name: 'Jefe de maquinaria'
        },
    ]

    const cambiarVistaPassword = () => {
        if(verPassword === 'password') {
            setVerPassword('text')
        }else{
            setVerPassword('password')
        } 
    }

    const cambiarVistaConfirmarPassword = () => {
        if(verConfirmarPassword === 'password') {
            setVerConfirmarPassword('text')
        }else{
            setVerConfirmarPassword('password')
        } 
    }

    const classes = useStyles()

    const handleChange = () => {

    }
        
    useEffect(() => {
        setTiposUsuarios(usersTypes)
    }, []);

    return (
        <Box>
            <div style={{height: height, width: '100%'}}>
                <Grid style={{height: height, padding: 30, marginLeft: 100}}>
                    <div style={{float: 'left', marginRight: 10}}>
                        <p>Foto de perfil</p>
                        <button style={{height: 224, width: 190, borderRadius: 8}}>
                            <FontAwesomeIcon icon={faPaperclip} style={{fontSize: 18}}/>
                            <br />
                            <br />
                            CARGAR
                            <br />
                            FOTO
                            
                        </button>
                    </div>
                    <div style={{float: 'left', width:"75%", marginRight: 10, marginTop: 0}}>
                        <div style={{width: '70vw', height: '12vh'}}>
                            <div style={{float: 'left', marginRight: 10}}>
                                <FormControl fullWidth>
                                    {/* <TextField id="outlined-basic" label="Rut" variant="outlined" /> */}
                                    <p>RUT</p>
                                    <input className={classes.inputsStyle} placeholder="11222333-K" type="text" style={{width: 293, height: 44, borderRadius: 10, fontSize: 20}} />
                                </FormControl>
                            </div>
                            <div style={{float: 'left'}}>
                                <FormControl fullWidth>
                                    <p>Tipo de usuario</p>
                                    <select className={classes.inputsStyle} name="userType" id="userType" style={{width: 248, height: 44, borderRadius: 10, fontSize: 20}}>
                                        {
                                            tiposUsuarios.map((usuario, index) => {
                                                return(
                                                    <option key={index} value={usuario.name.toLowerCase()}>{usuario.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </FormControl>
                            </div>
                        </div>
                        <div style={{width: '70vw', height: '12vh'}}>
                            <div style={{float: 'left', width: '45%', marginRight: 10}}>
                                <FormControl fullWidth>
                                    {/* <TextField id="outlined-basic" label="Rut" variant="outlined" /> */}
                                    <p>Nombre</p>
                                    <input className={classes.inputsStyle} placeholder="John" type="text" style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}} />
                                </FormControl>
                            </div>
                            <div style={{float: 'left', width: '45%'}}>
                                <FormControl fullWidth>
                                    {/* <TextField id="outlined-basic" label="Rut" variant="outlined" /> */}
                                    <p>Apellido</p>
                                    <input className={classes.inputsStyle} placeholder="Doe" type="text" style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}} />
                                </FormControl>
                            </div>
                        </div> 
                        <div style={{width: '70vw', height: '12vh'}}>
                            <div style={{float: 'left', width: '60%', marginRight: 10}}>
                                <FormControl fullWidth>
                                    {/* <TextField id="outlined-basic" label="Rut" variant="outlined" /> */}
                                    <p>Correo electrónico</p>
                                    <input className={classes.inputsStyle} placeholder="nombre@correo.cl" type="text" style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}} />
                                </FormControl>
                            </div>
                            <div style={{float: 'left', width: '30%'}}>
                                <FormControl fullWidth>
                                    {/* <TextField id="outlined-basic" label="Rut" variant="outlined" /> */}
                                    <p>Número de teléfono</p>
                                    <input className={classes.inputsStyle} placeholder="999998888" type="number" style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}} />
                                </FormControl>
                            </div>
                        </div> 
                        <div style={{width: '70vw', height: '12vh'}}>
                            <div style={{float: 'left', width: '37%', marginRight: 10}}>
                                <p>Contraseña</p>
                                <div style={{float: 'left', width: '100%'}}>
                                    <input maxLength={10}  className={classes.inputsStyle} placeholder="Min 6 carácteres" type={verPassword}
                                        style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20, paddingRight: 50}} />
                                </div>
                                <div style={{float: 'left', width: '1%', marginLeft: -50}}>
                                    <IconButton style={{width: 40}} onClick={() => {cambiarVistaPassword()}}>
                                        {
                                            verPassword === 'password' && <FontAwesomeIcon icon={faEye}/>
                                        }
                                        {
                                            verPassword === 'text' && <FontAwesomeIcon icon={faEyeSlash}/>
                                        }
                                    </IconButton>
                                </div>
                            </div>
                            <div style={{float: 'left', width: '37%'}}>
                                <p>Confirmar contraseña</p>
                                <div style={{float: 'left', width: '100%'}}>
                                    <input maxLength={10} className={classes.inputsStyle} placeholder="Repita contraseña" type={verConfirmarPassword}
                                        style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20, paddingRight: 50}} />
                                </div>
                                <div style={{float: 'left', width: '1%', marginLeft: -50}}>
                                    <IconButton style={{width: 40}} onClick={()=>{cambiarVistaConfirmarPassword()}}>
                                        {
                                            verConfirmarPassword === 'password' && <FontAwesomeIcon icon={faEye}/>
                                        }
                                        {
                                            verConfirmarPassword === 'text' && <FontAwesomeIcon icon={faEyeSlash}/>
                                        }
                                    </IconButton>
                                </div>
                            </div>
                        </div>                
                    </div>
                </Grid>
            </div>
        </Box>
    )
}

export default CreateUser