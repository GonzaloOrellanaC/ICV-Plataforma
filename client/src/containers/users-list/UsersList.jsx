import { useState, useEffect } from "react";
import { Toolbar, ListItem, IconButton, Grid } from "@material-ui/core";
import { faArrowUp, faInfoCircle, faPen, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useHistory } from 'react-router-dom';
import { usersRoutes } from '../../routes';
import { changeTypeUser } from '../../config';
import { UserListDataModal } from '../../modals'
import { io } from "socket.io-client";

const UsersList = ({height, hableButton}) => {
    const [ usuarios, setUsuarios ] = useState([])
    const [ open, setOpen ] = useState(false);
    const [ userModal, setUserModal ] = useState({});
    const [ indice, setIndice ] = useState(0);
    const [ checked, setCheck ] = useState(false);
    const [ permissionsReports, setPermissionsReports ] = useState([]);
    const [ permissionsUsers, setPermissionsUsers ] = useState([])

    const history = useHistory()

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
                if(cancel) setUsuarios(users.data);
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

    const sendTest = (_id) => {
        console.log(_id)
        const socket = io()
        socket.emit('test_user', {message: 'Envío de alerta desde el administrador.', id: _id})
    }

    return (
        <div style={{height: height}}>
            <div style={{height: height}}>
                {/* <Toolbar style={{width: '100%'}}>
                    <h1>Administrar usuarios</h1>
                    <Link to="/new-users">
                        <button disabled={!hableButton} style={{position: 'absolute', right: 20, width: 171, height: 38, borderRadius: 23, fontSize: 16}}>
                            <FontAwesomeIcon icon={faUser} style={{marginRight: 10}}/>
                            Crear usuario
                        </button>
                    </Link>
                </Toolbar> */}
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <Toolbar style={{width: '100%'}}>
                            <h1>Administrar usuarios</h1>
                        </Toolbar>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <div style={{width: '100%', textAlign: 'right'}}>
                            <Link to="/new-users">
                                <button disabled={!hableButton} style={{marginTop: 20, width: 171, height: 38, borderRadius: 23, fontSize: 16}}>
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
                        <div style={{width: '15%', marginLeft: 5, fontSize: 12}}>
                            <p style={{margin: 0}}> <strong>Nombre de usuario</strong> </p>
                        </div>
                        <div style={{width: '20%', marginLeft: 5, fontSize: 12}}>
                            <p style={{margin: 0}}> <strong>Correo electrónico</strong> </p>
                        </div>
                        <div style={{width: '10%', marginLeft: 5, fontSize: 12}}>
                            <p style={{margin: 0}}> <strong>RUN</strong> </p>
                        </div>
                        <div style={{width: '15%', marginLeft: 5, fontSize: 12}}>
                            <p style={{margin: 0}}> <strong>Rol</strong> </p>
                        </div>
                        <div style={{width: '10%', marginLeft: 5, fontSize: 12}}>
                            <p style={{margin: 0}}> <strong>Faena/Obra</strong> </p>
                        </div>
                        <div style={{width: '10%', marginLeft: 5, fontSize: 12}}>
                            <p style={{margin: 0}}> <strong>Estado</strong> </p>
                        </div>
                    </ListItem>
                </div>

                {
                    hableButton && <div style={{overflowY: 'auto', height: '53vh'}}>
                    {
                        usuarios.map((e, n) => {
                            if(!e.imageUrl) {
                                e.imageUrl = '../assets/no-profile-image.png'
                            }
                            e.roleTranslated = changeTypeUser(e.role);
                            return(
                                <ListItem key={n} style={well}>
                                    <div style={{width: '5%', marginLeft: 5, fontSize: 12 }}>
                                        <img style={{height: 50, borderRadius: '50%', objectFit: 'cover', width: 50}} src={e.imageUrl} alt="" /> 
                                    </div>
                                    <div style={{width: '15%', marginLeft: 5, fontSize: 12 }}>
                                        {e.name} {e.lastName}    
                                    </div>
                                    <div style={{width: '20%', marginLeft: 5, fontSize: 12, wordBreak: 'break-all' }}>
                                        {e.email}  
                                    </div>
                                    <div style={{width: '10%', marginLeft: 5, fontSize: 12 }}>
                                          {e.rut}
                                    </div>
                                    <div style={{width: '15%', marginLeft: 5, fontSize: 12 }}>
                                          {e.roleTranslated}
                                    </div>
                                    <div style={{width: '10%', marginLeft: 5, fontSize: 12 }}>
                                        
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
                                    <IconButton onClick={() => openModal(e, n)}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>
                                    </IconButton>
                                    <Link to={`/edit-user/${e._id}`}>
                                        <IconButton>
                                            <FontAwesomeIcon icon={faPen}/>
                                        </IconButton>
                                    </Link>
                                    <IconButton onClick={()=>{deleteUser(e._id, e.name, e.lastName, e.role)}}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </IconButton>
                                    <IconButton onClick={()=>{sendTest(e._id)}}>
                                        <FontAwesomeIcon icon={faArrowUp}/>
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