import { Box, Button, Card, Grid, IconButton, ListItem, Toolbar } from "@mui/material"
import { makeStyles } from '@mui/styles'
import { ArrowBackIos } from "@mui/icons-material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useStylesTheme } from "../../config"
import { PatternsDownloadedModal } from "../../modals"

const OptionsPage = () => {
    const classes = useStylesTheme();
    const navigate = useNavigate();
    const [openPatternsModal, setOpenPatternsModal] = useState(false)

    const clearAndLogout = () => {
        if(confirm('Limpiará toda la data del sistema y cerrará la sesión. Una vez terminado vuelva a iniciar.')) {
            window.indexedDB.databases().then((db) => {
                console.log(db)
                db.forEach((database, index) => {
                    window.indexedDB.deleteDatabase(database.name)
                    if(index == (db.length - 1)) {
                        window.localStorage.clear();
                        window.location.reload();
                        removeDatabases();
                    }
                })
            })
        }
    }

    const openPautas = () => {
        setOpenPatternsModal(true)
    }

    const closePatternsModal = () => {
        setOpenPatternsModal(false)
    }

    return (
        <Box height='100%'>
            {
                openPatternsModal && <PatternsDownloadedModal open={openPatternsModal} closeModal={closePatternsModal} />
            }
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', position: 'relative', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            navigate(-1)
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Opciones
                                        </h1>
                                    </Toolbar>
                                </div>
                            </div>
                        </Grid>
                        <Grid alignItems='center' justifyContent='center' style={{padding: 10, borderRadius: 20}}>
                            <Grid container>
                                <Grid item>
                                    <Grid container style={
                                        {
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#ccc',
                                            borderBottomStyle: 'solid',
                                            padding: 10
                                        }
                                    }>
                                        <Grid item>
                                            <div>
                                                <p><strong>Ver pautas descargadas</strong></p>
                                            </div>
                                        </Grid>
                                        <Grid item>
                                            <div style={
                                                {
                                                    marginTop: 10,
                                                    marginLeft: 15
                                                }
                                            }>
                                                <Button color={'primary'} onClick={() => {openPautas()}}>
                                                    Abrir
                                                </Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Grid container style={
                                        {
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#ccc',
                                            borderBottomStyle: 'solid',
                                            padding: 10
                                        }
                                    }>
                                        <Grid item>
                                            <div>
                                                <p><strong>Borrar Caché</strong> <br /> (Ésta acción borrará toda la información de la aplicación <br /> en el dispositivo)</p>
                                            </div>
                                        </Grid>
                                        <Grid item>
                                            <div style={
                                                {
                                                    marginTop: 26,
                                                    marginLeft: 15
                                                }
                                            }>
                                                <Button color={'primary'} onClick={() => {clearAndLogout()}}>
                                                    Borrar
                                                </Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default OptionsPage
