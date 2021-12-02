import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Toolbar, ListItem, IconButton, Checkbox, Button } from "@material-ui/core";
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import { faEye, faPen, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

const UsersList = ({height}) => {
    const [ usuarios, setUsuarios ] = useState([])
    
    useEffect(() => {
        
    }, []);

    const well = {
        height: 70,
        borderRadius: 10,
        boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.08)'
    }

    return (
        <div style={{height: height}}>
            <div style={{height: height}}>
                <Toolbar style={{width: '100%'}}>
                    <h1>Administrar usuarios</h1>
                    <Link to="/new-users">
                        <button style={{position: 'absolute', right: 20, width: 171, height: 38, borderRadius: 23, fontSize: 16}}>
                            <FontAwesomeIcon icon={faUser} style={{marginRight: 10}}/>
                            Crear usuario
                        </button>
                    </Link>
                </Toolbar>
                <ListItem>
                    <div style={{width: '25%', marginLeft: 5}}>
                        <p style={{margin: 0}}> <strong>Nombre de usuario</strong> </p>
                    </div>
                    <div style={{width: '20%', marginLeft: 5}}>
                        <p style={{margin: 0}}> <strong>Correo electrónico</strong> </p>
                    </div>
                    <div style={{width: '15%', marginLeft: 5}}>
                        <p style={{margin: 0}}> <strong>Contraseña</strong> </p>
                    </div>
                    <div style={{width: '15%', marginLeft: 5}}>
                        <p style={{margin: 0}}> <strong>Faena/Obra</strong> </p>
                    </div>
                    <div style={{width: '25%', marginLeft: 5}}>
                        <p style={{margin: 0}}> <strong>Estado</strong> </p>
                    </div>
                </ListItem>
                {usuarios && <div style={{height: height, overflowY: 'scroll'}}>
                    {
                        usuarios.map((e, n) => {
                            if(!e.obs01) {
                                e.obs01 = 'Sin Observaciones'
                            }
                            return(
                                <ListItem key={n} style={well}>
                                    <div style={{width: '15%', marginLeft: 5 }}>
                                        {e.workteamdesc}    
                                    </div>
                                    <div style={{width: '30%', marginLeft: 5 , overflowY: 'scroll', textOverflow: 'ellipsis', maxHeight: '100%'}}>
                                        {e.taskdesc}  
                                    </div>
                                    <div style={{width: '40%', marginLeft: 5 , overflowY: 'scroll', textOverflow: 'ellipsis', maxHeight: '100%'}}>
                                        {e.obs01}  
                                    </div>
                                    <IconButton>
                                        <FontAwesomeIcon icon={faEye}/>
                                    </IconButton>
                                    <IconButton>
                                        <FontAwesomeIcon icon={faPen}/>
                                    </IconButton>
                                    <Checkbox style={{transform: "scale(1.2)"}} icon={<CircleUnchecked />} checkedIcon={<CircleCheckedFilled style={{color: '#27AE60'}} />} />
                                </ListItem>
                            )
                        })
                    }   
                </div>}
            </div>
        </div>
    )
}

export default UsersList