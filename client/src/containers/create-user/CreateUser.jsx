import { useState, useEffect, useContext } from "react";
import { Grid, FormControl, IconButton, Checkbox } from "@material-ui/core";
import { faEye, faEyeSlash, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { rolesRoutes, usersRoutes } from '../../routes';
import { validate, format } from 'rut.js';
import { sitesDatabase } from "../../indexedDB";
import './CreateUser.css'
import ValidatorEmail from './emailValidator'
import { LoadingModal } from '../../modals'
import _init from './init';
import _continue from './continue'
import { imageToBase64 } from "../../config";
import { CreateUserContext, useSitesContext } from "../../context";

const CreateUser = ({typeDisplay, uData}) => {

    const {sites, setSiteSelected} = useSitesContext()
    const {setUserData, userData, rolesListSelectionCache, setRolesListSelectionCache, setChangeModule} = useContext(CreateUserContext)
    const [ verPassword, setVerPassword ] = useState('password');
    const [ verConfirmarPassword, setVerConfirmarPassword ] = useState('password');

    //UserData
    const [ rolesListSelection, setRolesListSelection ] = useState([]);
    /* const [ sites, setSites ] = useState([]); */
    const [ passwordNoIguales, setPasswordNoIguales ] = useState(false)
    const [ open, setOpen ] = useState(false);
    const [ imageUrl, setImageUrl ] = useState()

    const cambiarVistaPassword = () => {
        if(verPassword === 'password') {
            setVerPassword('text')
        }else{
            setVerPassword('password')
        } 
    }

    useEffect(() => {
        init()
    },[])

    const init = async () => {
        const roles = await rolesRoutes.getRoles()
        const rolesData = []
        roles.data.forEach(role => {
            role.selected = false
            if (role.dbName === 'superAdmin') {

            } else {
                rolesData.push(role)
            }
        })
        if (userData.roles.length === 0) {
            setRolesListSelectionCache(rolesData)
            setRolesListSelection(rolesData)
        } else {
            /* const rolesDataUser = [] */
            rolesData.forEach(role => {
                role.selected = false
                userData.roles.forEach(roleName => {
                    if (role.dbName === roleName) {
                        role.selected = true
                    }
                })
            })
            console.log(rolesData)
            setRolesListSelection(rolesData)
        }
        /* const {database} = await sitesDatabase.initDbObras()
        const sites = await sitesDatabase.consultar(database)
        setSites(sites) */
    }

    useEffect(() => {
        if (userData.password) {
            if (userData.confirmPassword) {
                if (userData.password.length > 5 && userData.confirmPassword.length > 5)
                if(userData.password === userData.confirmPassword) {
                    setPasswordNoIguales(false);
                    document.getElementById('passw').className = 'isValid';
                    document.getElementById('c_passw').className = 'isValid';
                }else{
                    setPasswordNoIguales(true)
                    document.getElementById('passw').className = 'isInvalid';
                    document.getElementById('c_passw').className = 'isInvalid';
                }
            }
        }
        if(!validate(userData.rut)) {
            document.getElementById('rut').className = 'isInvalid'
        }else{
            document.getElementById('rut').className = 'isValid'
        }
        if (userData.roles.length > 0) {
            const rolesCache = [...rolesListSelection]
            rolesCache.forEach(role => {
                userData.roles.forEach(roleUser => {
                    if (roleUser === role.dbName) {
                        role.selected = true
                    }
                })
            })
            setRolesListSelection(rolesCache)
            setRolesListSelectionCache(rolesCache)
        }
    },[userData])
    
    const cambiarVistaConfirmarPassword = () => {
        if(verConfirmarPassword === 'password') {
            setVerConfirmarPassword('text')
        }else{
            setVerConfirmarPassword('password')
        } 
    }


    const changeRut = (numero) => {
        if(numero==='-') {
            setUserData({...userData, rut: ''})
        }else{
            setUserData({...userData, rut: format(numero)})
        }
    }

    /* const classes = useStyles(); */

    const uploadImageProfile = async (file) => {
        let image = await imageToBase64(file);
        setImageUrl(image)
        /* saveUserData(image) */
    }

    const openFile = () => {
        if(uData._id) {
            document.getElementById('profileImage').click()
        }else{
            alert('Solo puede agregar foto una vez creado el usuario.')
        }
    }
    
    const selectRole = (event, index) => {
        const rolesListSelectionCache = [...rolesListSelection]
        const rolesSelected = []
        rolesListSelectionCache.forEach((role, number) => {
            /* if(role.selected) {
                rolesSelected.push(role.dbName)
            } */
            if (number === index) {
                role.selected = event.target.checked
                if(role.selected) {
                    rolesSelected.push(role.dbName)
                }
            }
        })
        setRolesListSelection(rolesListSelectionCache)
        setRolesListSelectionCache(rolesListSelectionCache)
        setChangeModule(true)
        /* setUserData({...userData, roles: rolesSelected}) */
    }

    useEffect(() => {
        console.log(rolesListSelection)
    },[rolesListSelection])

    return (
            <div style={{height: 'calc(100vh-500px)', width: '100%'}}>
                {(typeDisplay === 'Nuevo usuario') && <Grid>
                    <div>
                        <p>Para enrolar nuevo usuario debe ingresar todos los datos. <br /> Foto de perfil se podrá cargar una vez creado.</p>
                    </div>
                </Grid>}
                <Grid container>
                    <Grid item xl={(typeDisplay === 'Nuevo usuario') ? 'auto' : 3} lg={(typeDisplay === 'Nuevo usuario') ? 'auto' : 3} md={12} sm={12} xs={12} hidden={(typeDisplay === 'Nuevo usuario') ? true : false}>
                        <div style={{textAlign: 'center'}}>
                            <p>Foto de perfil</p>
                            <button style={{height: 224, width: 190, borderRadius: 8, objectFit: 'cover'}} onClick={()=>{ openFile();/* alert('No disponible.') */}}>
                                {!imageUrl ? <div>
                                    
                                    <FontAwesomeIcon icon={faPaperclip} style={{fontSize: 18}}/>
                                        <br />
                                        <br />
                                        CARGAR
                                        <br />
                                        FOTO
                                    </div> : <img src={imageUrl} style={{objectFit: 'cover', width: '100%'}} height={'100%'}/>}
                                
                            </button>
                            <input autoComplete="off" type="file" id="profileImage" onChange={(e)=>{uploadImageProfile(e.target.files[0])}} hidden />
                        </div>
                    </Grid>
                    <Grid item xl={(typeDisplay === 'Nuevo usuario') ? 12 : 9} lg={(typeDisplay === 'Nuevo usuario') ? 12 : 9} md={12} sm={12} xs={12}>
                        <Grid container>
                            <Grid item xl={8} lg={8}>
                                <Grid container>
                                    <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                                        <FormControl style={{width: '100%', paddingRight: 10}}>
                                            <p style={{margin: 0, marginTop: 5}}>RUT</p>
                                            <input 
                                                autoComplete="off"
                                                required
                                                id="rut"
                                                className="inputClass"
                                                type="text"
                                                minLength={11}
                                                maxLength={12}
                                                /* onBlur={()=>saveUserData()} */
                                                onInput={(e)=>changeRut(e.target.value)}
                                                value={userData.rut}
                                                placeholder="11.222.333-K"
                                                style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xl={8} lg={8} md={12} sm={12} xs={12}>
                                        <FormControl style={{width: '100%', paddingRight: 10}}>
                                            <p style={{margin: 0, marginTop: 5}}>Obra</p>
                                            <select 
                                                required 
                                                /* onBlur={()=>saveUserData()}  */
                                                name="site" 
                                                id="site" 
                                                style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}}
                                                onChange={(e)=> {setUserData({...userData, obras: [e.target.value]}); setSiteSelected(e.target.value)}}
                                                value={userData.obras[0]} 
                                                className="inputClass"
                                            >
                                                <option>Seleccione...</option>
                                                {
                                                    (sites.length > 0) && sites.map((obra, index) => {
                                                        return(
                                                            <option key={index} value={obra._id}>{obra.descripcion}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <FormControl style={{width: '100%', paddingRight: 10}}>
                                            <p style={{margin: 0, marginTop: 5}}>Obra</p>
                                            <select 
                                                required 
                                                name="test" 
                                                id="test" 
                                                style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}}
                                                onChange={(e)=> setUserData({...userData, isTest: e.target.value === 'true' ? true : false})}
                                                value={userData.isTest} 
                                                className="inputClass"
                                            >
                                                <option value={false}>Seleccione...</option>
                                                <option value={true}>Modo Test</option>
                                            </select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                        <FormControl style={{width: '100%', paddingRight: 10}}>
                                            <p style={{margin: 0, marginTop: 5}}>Nombre</p>
                                            <input autoComplete="off" required className="inputClass" id="name" 
                                                /* onBlur={()=>saveUserData()} */ 
                                                onChange={(e)=>setUserData({...userData, name: e.target.value})} 
                                                value={userData.name} placeholder="John" type="text" style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                        <FormControl style={{width: '100%', paddingRight: 10}}>
                                            <p style={{margin: 0, marginTop: 5}}>Apellido</p>
                                            <input autoComplete="off" required className="inputClass" id="lastName" 
                                            /* onBlur={()=>saveUserData()}  */
                                            onChange={(e)=>setUserData({...userData, lastName: e.target.value})} 
                                            value={userData.lastName} placeholder="Doe" type="text" style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xl={8} lg={8} md={6} sm={12} xs={12}>
                                        <FormControl style={{width: '100%', paddingRight: 10}}>
                                            <p style={{margin: 0, marginTop: 5}}>Correo electrónico</p>
                                            <input autoComplete="off" required id="email" 
                                            /* onBlur={()=>saveUserData()}  */
                                            onChange={(e)=>setUserData({...userData, email: e.target.value})}
                                            value={userData.email} placeholder="nombre@correo.cl" type="email" style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                                        <FormControl style={{width: '100%', paddingRight: 10}}>
                                            <p style={{margin: 0, marginTop: 5}}>Número de teléfono</p>
                                            <input autoComplete="off" required className="inputClass" id="phone" minLength={9} 
                                            /* onBlur={()=>saveUserData()}  */
                                            onInput={(e)=>{e.target.value = e.target.value.slice(0, 9)}}
                                            onChange={(e)=>setUserData({...userData, phone: e.target.value})}
                                            value={userData.phone} placeholder="999998888" type="phone" style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}} />
                                        </FormControl>
                                    </Grid>
                                    {
                                        (typeDisplay === 'Nuevo usuario') && 
                                        <Grid container>
                                            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                                <p style={{margin: 0, marginTop: 5}}>Contraseña</p>
                                                <div style={{float: 'left', width: '100%', paddingRight: 10}}>
                                                    <input autoComplete="off" id="passw" required className="isInvalid"
                                                        /* onBlur={()=>saveUserData()} */
                                                        onChange={(e)=>setUserData({...userData, password: e.target.value})}
                                                        value={userData.password} minLength={6} placeholder="Min 6 carácteres" type={verPassword}
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
                                            </Grid>
                                            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                                <p style={{margin: 0, marginTop: 5}}>Confirmar contraseña</p>
                                                <div style={{float: 'left', width: '100%', paddingRight: 10}}>
                                                    <input autoComplete="off" id="c_passw" required className="isInvalid"
                                                        /* onBlur={()=>saveUserData()} */
                                                        onChange={(e)=>setUserData({...userData, confirmPassword: e.target.value})}
                                                        value={userData.confirmPassword} minLength={6} placeholder="Repita contraseña" type={verConfirmarPassword}
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
                                            </Grid>
                                        </Grid>
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xl={4} lg={4}>
                                <Grid container style={{ height: '100%' }}>
                                    <div style={{
                                        padding: '0px 10px',
                                        borderLeftColor: '#ccc',
                                        borderLeftStyle: 'solid',
                                        borderLeftWidth: 1,
                                        height: '100%'
                                    }}>
                                        <div style={
                                            {
                                                marginTop: 10,
                                                marginPadding: 10
                                            }
                                        }>
                                            <h2>
                                                Roles de usuario
                                            </h2>
                                        </div>
                                        {
                                            rolesListSelection.map((role, n) => {
                                                return (
                                                    <Grid /* xl={3} lg={3} md={3}  */sm={12} item key={n}>
                                                        <Grid container>
                                                            <Grid item sm={1}>
                                                                <Checkbox
                                                                    style={{padding: 3}}
                                                                    /* disabled={((localStorage.getItem('role') === 'superAdmin') && (role.dbName === 'superAdmin')) && false} */
                                                                    checked={role.selected}
                                                                    onChange={(e) => { selectRole(e, n) }}
                                                                />
                                                            </Grid> 
                                                            <Grid item sm={11}>
                                                                <p style={{margin: '5px 0px 5px 10px'}}>{role.name}</p>
                                                            </Grid> 
                                                        </Grid>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        {
                            passwordNoIguales && <div style={{width: '100%', textAlign: 'center'}}>
                                <h3 style={{color: 'red'}}>Contraseñas no coinciden</h3>
                            </div>
                        }
                        <LoadingModal open={open} withProgress={false} loadingData={'Espere...'} />         
                    </Grid>
                </Grid>
            </div>
    )
}

export default CreateUser