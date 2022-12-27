import { useState, useEffect } from "react";
import { Toolbar, ListItem, IconButton, Grid } from "@material-ui/core";
import { faInfoCircle, faPen, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useHistory } from 'react-router-dom';
import { usersRoutes } from '../../routes';
import { changeTypeUser } from '../../config';
import { UserListDataModal } from '../../modals'
import { LoadingPage } from "../../pages";

const UsersList = ({height, hableButton}) => {
    const [ usuarios, setUsuarios ] = useState([])
    const [ usuariosCache, setUsuariosCache ] = useState([])
    const [ open, setOpen ] = useState(false);
    const [ userModal, setUserModal ] = useState({});
    const [ indice, setIndice ] = useState(0);
    const [ checked, setCheck ] = useState(false);
    const [ permissionsReports, setPermissionsReports ] = useState([]);
    const [ permissionsUsers, setPermissionsUsers ] = useState([])

    const handleChange = (event) => {
        setCheck(event.target.checked);
        usuarios[indice].enabled = event.target.checked
    }

    const openModal = (user, i) => {
        setUserModal(user);
        setCheck(user.enabled)
        setPermissionsReports(user.permissionsReports)
        setPermissionsUsers(user.permissionsUsers)
        setIndice(i)
        setOpen(true)
    }
    const closeModal = (user) => {
        setOpen(false);
        actualiceUser(user)
    }

    const actualiceUser = (user) => {
        usersRoutes.editUser(user).then(response=>{

        })
    }

    useEffect(() => {
        let cancel = true;
        if(cancel) {
            usersRoutes.getAllUsers().then(users=> {
                console.log(users)
                if(cancel) {
                    setUsuarios(users.data)
                    setUsuariosCache(users.data)
                }
            }) 
            localStorage.removeItem('userDataToSave');
        }
        return () => {cancel = false}
    }, []);


    const readAllUsers = () => {
        return new Promise(resolve => {
            usersRoutes.getAllUsers().then(users=> {
                resolve(users)
            })
        })
    }

    const deleteUser = (userId, userName, userLastName, userRole) => {
        if(userRole === 'admin') {
            alert('No es posible eliminar un Administrador.')
        }else{
            if(confirm(`Removerá al usuario ${userName} ${userLastName}. Confirme la acción.`)) {
                usersRoutes.removeUser(userId).then(async data=>{
                    if(data) {
                        setUsuarios((await readAllUsers()).data)
                    }
                })
            }
        }
    }

    const well = {
        height: 70,
        borderRadius: 10,
        boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.08)',
        fontSize: 14
    }

    const buscarUsuario = (value = new String()) => {
        console.log(value)
        if (value.length > 3) {
            const usuarios = usuariosCache.filter(usuario => {
                const name = usuario.name + ' ' + usuario.lastName
                if (name.toLocaleUpperCase().match(value.toLocaleUpperCase())) {
                    return usuario
                } else {
                    return null
                }
            })
            setUsuarios(usuarios)
        } else if (value.length === 0) {
            setUsuarios(usuariosCache)
        }
    }

    const buscarPorCorreo = (value = new String()) => {
        if (value.length > 3) {
            const usuarios = usuariosCache.filter(usuario => {
                const email = usuario.email
                if (email.toLocaleUpperCase().match(value.toLocaleUpperCase())) {
                    return usuario
                } else {
                    return null
                }
            })
            setUsuarios(usuarios)
        } else if (value.length === 0) {
            setUsuarios(usuariosCache)
        }
    }

    const buscarPorRut = (value = new String()) => {
        if (value.length > 3) {
            const usuarios = usuariosCache.filter(usuario => {
                if (usuario.rut) {
                    if (usuario.rut.match(value)) {
                        return usuario
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            })
            setUsuarios(usuarios)
        } else if (value.length === 0) {
            setUsuarios(usuariosCache)
        }
    }

    return (
        <div style={{height: height}}>
            <div style={{height: height}}>
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <Toolbar style={{width: '100%'}}>
                            <h1>Administrar usuarios</h1>
                        </Toolbar>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <div style={{width: '100%', textAlign: 'right'}}>
                            <Link to="/new-users">
                                <button disabled={!hableButton} style={{marginTop: 15, width: 171, height: 38, borderRadius: 23, fontSize: 16}}>
                                    <FontAwesomeIcon icon={faUser} style={{marginRight: 10}}/>
                                    Crear usuario
                                </button>
                            </Link>
                        </div>
                    </Grid>
                </Grid>
                <div>
                    <ListItem>
                        <div style={{width: '5%', marginLeft: 5, fontSize: 12}}>
                            
                        </div>
                        <div style={{width: '10%', marginLeft: 5, fontSize: 12}}>
                            <p style={{margin: 0}}> <strong>Nombre de usuario</strong> </p>
                            <input
                                type={'text'}
                                placeholder="Buscar por nombre"
                                onChange={(e) => {buscarUsuario(e.target.value)}}
                            />
                        </div>
                        <div style={{width: '10%', marginLeft: 5, fontSize: 12}}>
                            <p style={{margin: 0}}> <strong>Correo electrónico</strong> </p>
                            <input
                                type={'text'}
                                placeholder="Buscar por correo"
                                onChange={(e) => {buscarPorCorreo(e.target.value)}}
                            />
                        </div>
                        <div style={{width: '10%', marginLeft: 5, fontSize: 12}}>
                            <p style={{margin: 0}}> <strong>RUN</strong> </p>
                            <input
                                style={
                                    {
                                        width: 110
                                    }
                                }
                                type={'text'}
                                placeholder="Buscar por RUN"
                                onChange={(e) => {buscarPorRut(e.target.value)}}
                            />
                        </div>
                        <div style={{width: '15%', marginLeft: 5, fontSize: 12}}>
                            <p style={{margin: 0, marginBottom: 22}}> <strong>Rol</strong> </p>
                        </div>
                        <div style={{width: '15%', marginLeft: 5, fontSize: 12}}>
                            <p style={{margin: 0, marginBottom: 22}}> <strong>Faena/Obra</strong> </p>
                        </div>
                        <div style={{width: '10%', marginLeft: 5, fontSize: 12}}>
                            <p style={{margin: 0, marginBottom: 22}}> <strong>Estado</strong> </p>
                        </div>
                    </ListItem>
                </div>

                {
                    hableButton && <div style={{overflowY: 'auto', height: 'calc(100vh - 350px)'}}>
                        {
                            (usuarios.length === 0)
                            &&
                            <LoadingPage />
                        }
                        {
                            usuarios.map((e, n) => {
                                return(
                                    <ListItem key={n} style={well}>
                                        <div style={{width: '5%', marginLeft: 5, fontSize: 12 }}>
                                            <img style={{height: 50, borderRadius: '50%', objectFit: 'cover', width: 50}} src={!e.imageUrl ? '../assets/no-profile-image.png' : e.imageUrl} alt="" /> 
                                        </div>
                                        <div style={{width: '10%', marginLeft: 5, fontSize: 12 }}>
                                            {e.name} {e.lastName}    
                                        </div>
                                        <div style={{width: '10%', marginLeft: 5, fontSize: 12, wordBreak: 'break-all' }}>
                                            {e.email === 'x@x.xx' ? '----' : e.email}  
                                        </div>
                                        <div style={{width: '10%', marginLeft: 5, fontSize: 12 }}>
                                            {e.rut}
                                        </div>
                                        <div style={{width: '15%', marginLeft: 5, fontSize: 12, overflowY: 'auto', maxHeight: 50 }}>
                                            {
                                                (e.role && (e.role.length > 0))
                                                ?
                                                changeTypeUser(e.role)
                                                :
                                                e.roles.map((role, number) => {
                                                    return (
                                                        <p key={number} style={{ margin: 0 }}>
                                                            {
                                                                changeTypeUser(role)
                                                            }
                                                        </p>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div style={{width: '15%', marginLeft: 5, fontSize: 12 }}>
                                            {e.sites && (JSON.parse(e.sites)).descripcion}
                                        </div>
                                        <div style={{width: '10%', marginLeft: 5, fontSize: 12 }}>
                                            {
                                                e.enabled &&
                                                <p style={{borderRadius: 5, maxWidth: 200, textAlign: 'center', backgroundColor: '#C3EBD4', paddingTop: 3, paddingRight: 28, paddingBottom: 3, paddingLeft: 28}}>
                                                    ACTIVO
                                                </p>
                                            }
                                            {
                                                !e.enabled &&
                                                <p style={{borderRadius: 5, maxWidth: 200, textAlign: 'center', backgroundColor: '#F9F9F9', paddingTop: 3, paddingRight: 28, paddingBottom: 3, paddingLeft: 28}}>
                                                    INACTIVO
                                                </p>
                                            }
                                        </div>
                                        <IconButton title="Información del usuario" onClick={() => openModal(e, n)}>
                                            <FontAwesomeIcon icon={faInfoCircle}/>
                                        </IconButton>
                                        <Link to={`/edit-user/${e._id}`}>
                                            <IconButton title="Editar usuario">
                                                <FontAwesomeIcon icon={faPen}/>
                                            </IconButton>
                                        </Link>
                                        <IconButton title="Borrar usuario" onClick={()=>{deleteUser(e._id, e.name, e.lastName, e.role)}}>
                                            <FontAwesomeIcon icon={faTrash}/>
                                        </IconButton>
                                    </ListItem>
                                )
                            })
                        }
                        {
                            userModal && <UserListDataModal 
                                open={open} 
                                userModal={userModal} 
                                handleChange={handleChange} 
                                checked={checked}
                                permissionsReports={permissionsReports}
                                permissionsUsers={permissionsUsers}
                                closeModal={closeModal}
                                />
                        }
                </div>
                }
                {
                    !hableButton && 
                    <div style={{textAlign: 'center', width: '100%', height: '50%', paddingTop: 50}}>
                        <h1>Requiere conexión a internet para administración de usuarios</h1>
                    </div>
                }
            </div>
        </div>
    )
}

export default UsersList