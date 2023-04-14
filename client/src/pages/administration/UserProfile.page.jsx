import React, { useEffect, useState } from 'react'
import { Box, Card, Grid, Toolbar, IconButton } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { changeTypeUser, useStylesTheme } from '../../config'
import { useHistory } from 'react-router-dom'
import { usersRoutes } from '../../routes'

const UserProfilePage = ({route}) => {
    const [userData, setUserData ] = useState();
    const [ users, setUsers ] = useState([])
    const classes = useStylesTheme();
    const history = useHistory();

    useEffect(() => {
        const _id = localStorage.getItem('_id');
        if(navigator.onLine) {
            usersRoutes.getAllUsers().then(async users => {
                let usersList = new Array();
                usersList = users.data;
                if(usersList) {
                    let me = usersList.filter(u => {if(u._id === _id){return u}});
                    console.log(me)
                    if(!me[0].imageUrl) {
                        me[0].imageUrl = '../assets/no-profile-image.png'
                    }
                    setUserData(me[0]);
                    let list = usersList.filter(u => {if((u._id != _id)&&(u.role != 'admin')){return u}});
                    setUsers(list);
                }
            })
        }else{
            setTimeout(() => {
                alert('Dispositivo sin conexión. Revise si cuenta con internet e intente nuevamente.');
                history.goBack();
            }, 100);
        }
    }, [])
    
    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            history.goBack()
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Perfil
                                        </h1>
                                    </Toolbar>
                                </div>
                            </div>
                        </Grid>
                        <Grid container alignItems='center' justifyContent='center'>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                {userData && <Grid container>
                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                        <div style={{padding: 20, textAlign: 'right'}}>
                                            <img src={userData.imageUrl} style={{maxHeight: 300, maxWidth: 300, objectFit: 'cover'}} width={'100%'} alt="" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                        {userData && <div style={{padding: 20}}>
                                            <h1>{userData.name} {userData.lastName}</h1>
                                            <h3>{changeTypeUser(userData.role)}</h3>
                                            <h3>{userData.rut}</h3>
                                            <h3>{userData.email}</h3>
                                            <h3>+56{userData.phone}</h3>
                                            <h3>{(JSON.parse(userData.sites)).idobra} - {(JSON.parse(userData.sites)).descripcion}</h3>
                                            <div style={{width: '100%', textAlign: 'center'}}>
                                                <div style={{width: 200, height: 200}}>
                                                    <h3>Firma</h3>
                                                    <img src={userData.sign} width={200} height={200} />
                                                </div>
                                            </div>
                                        </div>}
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4} lg={4}>
                                        <div style={{ padding: 20 }}>
                                            <h1>Otros usuarios</h1>
                                        </div>
                                        <div style={{padding: 20, maxHeight: 'calc(100vh - 320px)', overflowY: 'auto'}}>
                                            {
                                                users.map((e, i) => {
                                                    if(!e.imageUrl) {
                                                        e.imageUrl = '../assets/no-profile-image.png'
                                                    }
                                                    return(
                                                        <div key={i} style={{width: '100%'}}>
                                                            <Grid container>
                                                                <Grid item xs={4} sm={3} lg={2} xl={2}>
                                                                    <img src={e.imageUrl} width={50} height={50} style={{objectFit: 'cover', borderRadius: '50%'}} alt="" />
                                                                </Grid>
                                                                <Grid item xs={6} sm={4} lg={4} xl={4}>
                                                                    <p>{e.name} {e.lastName}</p>
                                                                </Grid>
                                                                <Grid item xs={12} sm={5} lg={4} xl={4}>
                                                                    <p>{changeTypeUser(e.role)}</p>
                                                                </Grid>
                                                            </Grid>
                                                            <br />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Grid>
                                </Grid>}
                            </Grid>  
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default UserProfilePage