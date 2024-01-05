import { Box, Card, Grid, Toolbar, IconButton } from '@mui/material'
import { ArrowBackIos } from '@mui/icons-material'
import { useStylesTheme } from '../../config'


const UserformPage = () => {
    const classes = useStylesTheme();
    const navigate = useNavigate()

    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid container style={{ height: '100%' }} alignItems='center' justifyContent='center'>
                        <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                            <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                <Toolbar style={{paddingLeft: 0}}>
                                    <IconButton onClick={() => setTimeout(() => {
                                        navigate(-1)
                                    }, 500)}> 
                                        <ArrowBackIos style={{color: '#333', fontSize: 35}}/> 
                                    </IconButton> 
                                    <h1 style={{marginTop: 0, marginBottom: 0}}> {`Administración/Nuevo Usuario`} </h1>
                                </Toolbar>
                            </div>
                        </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default UserformPage