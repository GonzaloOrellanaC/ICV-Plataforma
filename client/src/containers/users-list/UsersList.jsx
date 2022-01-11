import { useState, useEffect } from "react";
import { Toolbar, ListItem, IconButton, Grid } from "@material-ui/core";
import { faInfoCircle, faPen, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useHistory } from 'react-router-dom';
import { usersRoutes } from '../../routes';
import { changeTypeUser } from '../../config';
import { UserListDataModal } from '../../modals'

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
        readAllUsers();
        localStorage.removeItem('userDataToSave')
        setTimeout(() => {

        }, 1000);
    }, []);

    const readAllUsers = () => {
        usersRoutes.getAllUsers().then(users=> {
            setUsuarios(users.data);
        })
    }

    const deleteUser = (userId, userName, userLastName, userRole) => {
        if(userRole === 'admin') {
            alert('No es posible eliminar un Administrador.')
        }else{
            if(confirm(`Removerá al usuario ${userName} ${userLastName}. Confirme la acción.`)) {
                usersRoutes.removeUser(userId).then(data=>{
                    if(data) {
                        readAllUsers()
                    }
                })
            }
        }
    }

    const well = {
        height: 70,
        borderRadius: 10,
        boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.08)'
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
                        <Toolbar style={{width: '100%', textAlign: 'right'}}>
                            <Link to="/new-users">
                                <button disabled={!hableButton} style={{/* position: 'absolute', right: 20,  */width: 171, height: 38, borderRadius: 23, fontSize: 16}}>
                                    <FontAwesomeIcon icon={faUser} style={{marginRight: 10}}/>
                                    Crear usuario
                                </button>
                            </Link>
                        </Toolbar>
                    </Grid>
                </Grid>
                <div>
                    <ListItem>
                        <div style={{width: '15%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>Nombre de usuario</strong> </p>
                        </div>
                        <div style={{width: '20%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>Correo electrónico</strong> </p>
                        </div>
                        <div style={{width: '10%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>RUN</strong> </p>
                        </div>
                        <div style={{width: '20%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>Rol</strong> </p>
                        </div>
                        <div style={{width: '10%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>Faena/Obra</strong> </p>
                        </div>
                        <div style={{width: '10%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>Estado</strong> </p>
                        </div>
                    </ListItem>
                </div>

                {
                    hableButton && <div style={{overflowY: 'auto'}}>
                    {
                        usuarios.map((e, n) => {
                            e.roleTranslated = changeTypeUser(e.role);
                            return(
                                <ListItem key={n} style={well}>
                                    <div style={{width: '15%', marginLeft: 5 }}>
                                        {e.name} {e.lastName}    
                                    </div>
                                    <div style={{width: '20%', marginLeft: 5, wordBreak: 'break-all' }}>
                                        {e.email}  
                                    </div>
                                    <div style={{width: '10%', marginLeft: 5 }}>
                                          {e.rut}
                                    </div>
                                    <div style={{width: '20%', marginLeft: 5 }}>
                                          {e.roleTranslated}
                                    </div>
                                    <div style={{width: '10%', marginLeft: 5 }}>
                                        
                                    </div>
                                    <div style={{width: '10%', marginLeft: 5 }}>
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