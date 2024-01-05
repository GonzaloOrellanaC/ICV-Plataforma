import React, {useState, useEffect} from 'react';
import { Box, Card, Grid, Toolbar, IconButton } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { useStylesTheme } from '../../config';
import { useNavigate } from 'react-router-dom';
import { UsersList } from '../../containers';
import './style.css'

const RolesPage = ({route}) => {
    const [ isConnected, setIsConnected ] = useState(false)
    const classes = useStylesTheme();
    const navigate = useNavigate();

    useEffect(() => {
        if(navigator.onLine) {
            setIsConnected(true)
        }else{
            setIsConnected(false)
        }
    }, [])



    return (
        <Box height='100%'>
            <Grid className='root' container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            navigate(-1)
                                        }, 500)}>
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton>
                                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Administración / Administrar usuarios
                                        </h1>
                                    </Toolbar>
                                </div>
                            </div>
                        </Grid>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 20, overflowY: 'auto', height: 'calc(100vh - 200px)'}}>
                                {/* <UsersList height={'100%'} hableButton={isConnected}/> */}
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default RolesPage