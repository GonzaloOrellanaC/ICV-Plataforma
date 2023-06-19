import React, { useEffect, useState } from 'react'
import { Button, Grid, IconButton, Link, makeStyles, TextField } from '@material-ui/core'
import { useLanguage } from '../../context'
import { useNavigate } from 'react-router-dom';
import { authRoutes } from '../../routes';
import './resetUser.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles(theme => ({
    button: {
        borderRadius: 20,
        maxWidth: 400, 
        minWidth: 300, 
        width: '100%'
    }
}))

const RestorePassword = ({id}) => {
    const { dictionary } = useLanguage();
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ token, setToken ] = useState('');

    const [ isAlert, setAlert ] = useState(false);
    const [ passwLength, setPasswLength ] = useState(false);

    const classes = useStyles();
    const navigate = useNavigate();
    const [ verPassword, setVerPassword ] = useState('password')
    const [ verPassword2, setVerPassword2 ] = useState('password')

    const cambiarVistaPassword = () => {
        if(verPassword === 'password') {
            setVerPassword('text')
        }else{
            setVerPassword('password')
        } 
    }

    const cambiarVistaPassword2 = () => {
        if(verPassword2 === 'password') {
            setVerPassword2('text')
        }else{
            setVerPassword2('password')
        } 
    }

    useEffect(() => {
        setToken(id)
    }, [])

    const handleChange = (event) => {
        switch (event?.target?.name) {
            case 'password':
                return setPassword(event.target.value)
            case 'confirmPassword':
                return setConfirmPassword(event.target.value)
        }
        
    }

    const handleSubmit = async () => {
        if(password === confirmPassword) {
            if(password.length > 5) {
                authRoutes.restorePassword(password, token).then(data => {
                    alert('Contraseña cambiada con éxito');
                    navigate('/');
                }).catch(err => {
                    alert('Error al crear contraseña. El correo utilizado está vencido. Revise si le ha llegado un correo nuevo con la solicitud de restauración de contraseña actualizado o espere un máximo de 10 minutos más. Si el error persiste, contacte al administrador.')
                })
                /* setAlertData('Contraseña debe contar con al menos 6 carácteres.') */
            }else{
                alert('Contraseña debe contener al menos 6 carácteres.')
            }
        }else{
            alert('Contraseñas ingresadas no coinciden')
        }
    }

    const detectPass = (event) => {
        if(password === confirmPassword) {
            setAlert(false)
        }else{
            setAlert(true)
        }
        if((password.length < 6) /* || (confirmPassword.length < 6) */) {
            setPasswLength(true)
        }else{
            setPasswLength(false)
        }
    }

    return (
        <Grid container style={{ padding: 20, height: '50%' }} alignItems='center' justifyContent='center'>
            <form>
                <Grid container item spacing={2}>
                    <Grid item xs={12} container justifyContent='center'>
                        <TextField
                            type={verPassword}
                            name='password'
                            label={dictionary.restorePassword.passwordField}
                            value={password}
                            onChange={handleChange}
                            onBlur={(e) => detectPass(e)}
                            variant='outlined'
                            style={{maxWidth: 400, minWidth: 300, width: '100%'}}
                            id="password"
                            
                        />
                        <IconButton style={{width: 0, position: 'relative', right: 25, zIndex: 1, padding: 0}} onClick={() => {cambiarVistaPassword()}}>
                            {
                                verPassword === 'password' && <FontAwesomeIcon icon={faEye}/>
                            }
                            {
                                verPassword === 'text' && <FontAwesomeIcon icon={faEyeSlash}/>
                            }
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} container justifyContent='center' style={{paddingTop: 10}}>
                        <TextField
                            type={verPassword2}
                            name='confirmPassword'
                            label={dictionary.restorePassword.confirmPasswordField}
                            value={confirmPassword}
                            onChange={handleChange}
                            onBlur={(e) => detectPass(e)}
                            variant='outlined'
                            style={{maxWidth: 400, minWidth: 300, width: '100%'}}
                            id="c_password"
                            
                        />
                        <IconButton style={{width: 0, position: 'relative', right: 25, zIndex: 1, padding: 0}} onClick={() => {cambiarVistaPassword2()}}>
                            {
                                verPassword2 === 'password' && <FontAwesomeIcon icon={faEye}/>
                            }
                            {
                                verPassword2 === 'text' && <FontAwesomeIcon icon={faEyeSlash}/>
                            }
                        </IconButton>
                    </Grid>
                    {
                        passwLength && <div style={{width: '100%', textAlign: 'center'}}>
                            <p style={{color: 'red'}}><strong>Contraseñas deben ser de 6 carácteres mínimo</strong></p>
                        </div>  
                    }
                    {
                        isAlert && <div style={{width: '100%', textAlign: 'center'}}>
                            <p style={{color: 'red'}}><strong>Contraseñas no coinciden</strong></p>
                        </div>  
                    }
                        
                        {/* <div style={{width: '100%', textAlign: 'center'}}>
                            <p>Nivel de seguridad</p>
                            <progress max="100" value="0" id="meter"></progress>
                            <p>Si agrega a la contrseña letras mayúsculas, números y símbolos, el nivel de seguridad aumenta.</p>
                        </div> */}
                    <Grid item xs={12} container justifyContent='center' style={{paddingTop: 10}}>
                        <Button className={classes.button} variant='contained' color='primary' onClick={()=>{handleSubmit()}}>
                            {/* {dictionary.login.loginButton} */}
                            {dictionary.restorePassword.button}
                        </Button>
                    </Grid>
                    <Grid item xs={12} container justifyContent='center' style={{paddingTop: 10}}>
                        <Button className={classes.button} variant='contained' color='primary' onClick={()=>{navigate('/', {replace: true})}}>
                            {dictionary.restorePassword.cancel}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    )
}

export default RestorePassword