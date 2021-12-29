import { useState, useEffect } from "react";
import { makeStyles, Grid, Box, FormControl, IconButton } from "@material-ui/core";
import { faEye, faEyeSlash, faPaperclip, faUserCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { rolesRoutes } from '../../routes';
import { validate, clean, format, getCheckDigit } from 'rut.js';
import { sitesDatabase } from "../../indexedDB";

const useStyles = makeStyles(theme => ({
    inputsStyle: {
        borderColor: '#C4C4C4'
    }
}));

const CreateUser = ({height, typeDisplay}) => {

    const [ tiposUsuarios, setTiposUsuarios ] = useState([]);
    const [ verPassword, setVerPassword ] = useState('password');
    const [ verConfirmarPassword, setVerConfirmarPassword ] = useState('password');

    //UserData
    const [ name, setName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ rut, setRut ] = useState('');
    const [ role, setUserType ] = useState('');
    const [ userSite, setSiteToUser ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ usersTypes, setUserTypes ] = useState([]);
    const [ sites, setSites ] = useState([]);

    const cambiarVistaPassword = () => {
        if(verPassword === 'password') {
            setVerPassword('text')
        }else{
            setVerPassword('password')
        } 
    }

    const userData = {
        name: name,
        lastName: lastName,
        rut: rut,
        role: role,
        email: email,
        phone: phone,
        password: password,
        sites: userSite,
        confirmPassword: confirmPassword,
        createdBy: localStorage.getItem('_id')
    }

    const saveUserData = () => {
        localStorage.setItem('userDataToSave', JSON.stringify(userData));
        console.log(JSON.parse(localStorage.getItem('userDataToSave')));
    }

    const cambiarVistaConfirmarPassword = () => {
        if(verConfirmarPassword === 'password') {
            setVerConfirmarPassword('text')
        }else{
            setVerConfirmarPassword('password')
        } 
    }

    const getRoles = () => {
        return new Promise(async resolve => {
            const responseRoles = await rolesRoutes.getRoles();
            setUserTypes(responseRoles.data);
        })
    }

    const getSites = () => {
        return new Promise(async resolve => {
            const db = await sitesDatabase.initDbObras();
            if(db) {
                const sites = await sitesDatabase.consultar(db.database);
                setSites(sites)
            }
        })
    }

    const changeRut = (numero) => {
        if(numero==='') {

        }else{
            setRut(format(numero))
        }
    }

    const classes = useStyles()
        
    useEffect(() => {
        getSites()
        setTimeout(() => {
            let userDataToContinue = localStorage.getItem('userDataToSave');
            if(userDataToContinue) {
                //console.log(JSON.parse(userDataToContinue));
                let data = JSON.parse(userDataToContinue);
                if(data.rut) {
                    setRut(data.rut)
                }
                if(data.name) {
                    setName(data.name)
                }
                if(data.lastName) {
                    setLastName(data.lastName)
                }
                if(data.email) {
                    setEmail(data.email)
                }
                if(data.phone) {
                    setPhone(data.phone)
                }
                if(data.role) {
                    setUserType(data.role)
                }
                if(data.sites) {
                    setSiteToUser(data.sites)
                }
                if(data.password && (typeDisplay === 'Nuevo usuario')) {
                    setPassword(data.password)
                }
                if(data.confirmPassword && (typeDisplay === 'Nuevo usuario')) {
                    setConfirmPassword(data.confirmPassword)
                }
            }
            setTiposUsuarios(usersTypes)
            getRoles()
        }, 500);
    }, []);

    return (
        <Box>
            <div style={{height: height, width: '100%'}}>
                <Grid style={{height: height, padding: 30, marginLeft: 100}}>
                    <div style={{float: 'left', marginRight: 10}}>
                        <p>Foto de perfil</p>
                        <button style={{height: 224, width: 190, borderRadius: 8}} onClick={()=>{alert('No disponible.')}}>
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
                                    <input maxLength={12} onBlur={()=>saveUserData()} onInput={(e)=>changeRut(e.target.value)} /* onChange={(e)=>{setRut(e.target.value)}} */ value={rut} className={classes.inputsStyle} placeholder="11.222.333-K" type="text" style={{width: 293, height: 44, borderRadius: 10, fontSize: 20}} />
                                </FormControl>
                            </div>
                            <div style={{float: 'left'}}>
                                <FormControl fullWidth>
                                    <p>Tipo de usuario</p>
                                    <select 
                                        onBlur={()=>saveUserData()} 
                                        className={classes.inputsStyle} 
                                        name="userType" 
                                        id="userType" 
                                        style={{width: 248, height: 44, borderRadius: 10, fontSize: 20, marginRight: 10}}
                                        onChange={(e)=> setUserType(e.target.value)}
                                        value={role} 
                                    >
                                        <option key={100} value={''}>Seleccione...</option>
                                        {
                                            usersTypes.filter((item, i) => {if(i > 0) { return item }}).map((usuario, index) => {
                                                return(
                                                    <option key={index} value={usuario.dbName}>{usuario.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </FormControl>
                            </div>
                            <div style={{float: 'left'}}>
                                <FormControl fullWidth>
                                    <p>Obra</p>
                                    <select 
                                        onBlur={()=>saveUserData()} 
                                        className={classes.inputsStyle} 
                                        name="userType" 
                                        id="userType" 
                                        style={{width: 548, height: 44, borderRadius: 10, fontSize: 20}}
                                        onChange={(e)=> /* console.log(e.target.value) */  setSiteToUser(e.target.value)}
                                        value={userSite} 
                                    >
                                        <option key={100} value={''}>Seleccione...</option>
                                        {
                                            sites./* filter((item, i) => {if(i > 0) { return item }}). */map((obra, index) => {
                                                return(
                                                    <option key={index} value={JSON.stringify(obra)}>{obra.descripcion}</option>
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
                                    <p>Nombre</p>
                                    <input onBlur={()=>saveUserData()} onChange={(e)=>setName(e.target.value)} value={name} className={classes.inputsStyle} placeholder="John" type="text" style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}} />
                                </FormControl>
                            </div>
                            <div style={{float: 'left', width: '45%'}}>
                                <FormControl fullWidth>
                                    <p>Apellido</p>
                                    <input onBlur={()=>saveUserData()} onChange={(e)=>setLastName(e.target.value)} value={lastName} className={classes.inputsStyle} placeholder="Doe" type="text" style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}} />
                                </FormControl>
                            </div>
                        </div> 
                        <div style={{width: '70vw', height: '12vh'}}>
                            <div style={{float: 'left', width: '60%', marginRight: 10}}>
                                <FormControl fullWidth>
                                    <p>Correo electrónico</p>
                                    <input onBlur={()=>saveUserData()} onChange={(e)=>setEmail(e.target.value)} value={email} className={classes.inputsStyle} placeholder="nombre@correo.cl" type="email" style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}} />
                                </FormControl>
                            </div>
                            <div style={{float: 'left', width: '30%'}}>
                                <FormControl fullWidth>
                                    <p>Número de teléfono</p>
                                    <input max={9} onBlur={()=>saveUserData()} onInput={(e)=>{e.target.value = e.target.value.slice(0, 9); console.log(e.target.value)}} onChange={(e)=>setPhone(e.target.value)} value={phone} className={classes.inputsStyle} placeholder="999998888" type="number" style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}} />
                                </FormControl>
                            </div>
                        </div> 
                        {(typeDisplay === 'Nuevo usuario') && <div style={{width: '70vw', height: '12vh'}}>
                            <div style={{float: 'left', width: '37%', marginRight: 10}}>
                                <p>Contraseña</p>
                                <div style={{float: 'left', width: '100%'}}>
                                    <input onBlur={()=>saveUserData()} onChange={(e)=>setPassword(e.target.value)} value={password} maxLength={10}  className={classes.inputsStyle} placeholder="Min 6 carácteres" type={verPassword}
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
                                    <input onBlur={()=>saveUserData()} onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} maxLength={10} className={classes.inputsStyle} placeholder="Repita contraseña" type={verConfirmarPassword}
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
                        </div> }                
                    </div>
                </Grid>
            </div>
        </Box>
    )
}

export default CreateUser