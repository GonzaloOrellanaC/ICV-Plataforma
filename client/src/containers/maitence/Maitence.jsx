import React, { useState } from 'react'

import { Button, Grid, Card, makeStyles, TextField } from '@material-ui/core'
import { useLanguage } from '../../context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles(theme => ({
    
}))

const Maitence = () => {
    const { dictionary } = useLanguage()

    const classes = useStyles()

    return (
        <div style={{marginTop: 20, paddingBottom: 10, borderWidth: 2, borderStyle: 'solid', borderColor: '#000', backgroundColor: 'rgba(255,  255,  255,  0.5)'}}>
            <div style={{textAlign: 'center'}}>
                <h2 style={{margin: 0}}>
                    Mantención
                </h2>
            </div>
            

            <Grid container spacing={1}>
                <div style={{width: '50%', textAlign: 'center', paddingTop: 5, paddingLeft: 10, paddingBottom: 5, paddingRight: 5}}>
                    <Card elevation={0}>
                        <Grid container spacing={1}>
                            <div style={{width: '20%', textAlign: 'center', paddingTop: 5, paddingLeft: 10, paddingBottom: 5, paddingRight: 10}}>
                                <h2>
                                    14
                                </h2>
                            </div>
                            <div style={{width: '80%', textAlign: 'center', paddingTop: 5, paddingLeft: 5, paddingBottom: 5, paddingRight: 5}}>
                                <p style={{fontSize: 12}}>
                                    Alertas totales durante el turno
                                </p>
                            </div>
                        </Grid>
                    </Card>
                </div>
                <div style={{width: '50%', textAlign: 'center', paddingTop: 5, paddingLeft: 5, paddingBottom: 5, paddingRight: 10}}>
                    <Card elevation={0}>
                        <Grid container spacing={1}>
                            <div style={{width: '20%', textAlign: 'center', paddingTop: 5, paddingLeft: 5, paddingBottom: 5, paddingRight: 5}}>
                                <h2>
                                    0
                                </h2>
                            </div>
                            <div style={{width: '80%', textAlign: 'center', paddingTop: 5, paddingLeft: 5, paddingBottom: 5, paddingRight: 5}}>
                                <p style={{fontSize: 12, marginTop: '0.5rem', marginBottom: 0}}>
                                    Inspecciones pendientes en la semana
                                </p>
                            </div>
                        </Grid>
                    </Card>
                </div>
                
                <Grid container spacing={1}>
                    <div style={{width: '10%', textAlign: 'left', paddingLeft: 20, paddingTop: 10}}>
                        {<FontAwesomeIcon icon={faCircle} size='2x' color='#27AE60'/>}
                    </div>
                    <div style={{width: '40%', textAlign: 'left', paddingLeft: 20}}>
                        <p>
                            Aceptadas
                        </p>
                    </div>
                    <div style={{width: '20%', textAlign: 'left', paddingLeft: 20}}>
                        <p>
                            10
                        </p>
                    </div>
                    <div style={{width: '30%', textAlign: 'left', paddingLeft: 20, paddingTop: 5}}>
                        <Button>
                            VER
                        </Button>
                    </div>
                </Grid>
                <Grid container spacing={1}>
                     <div style={{width: '10%', textAlign: 'left', paddingLeft: 20, paddingTop: 10}}>
                        {<FontAwesomeIcon icon={faCircle} size='2x' color='#333333'/>}
                    </div> 
                    <div style={{width: '40%', textAlign: 'left', paddingLeft: 20}}>
                        <p>
                            Completadas
                        </p>
                    </div>
                    <div style={{width: '20%', textAlign: 'left', paddingLeft: 20}}>
                        <p>
                            3
                        </p>
                    </div>
                    <div style={{width: '30%', textAlign: 'left', paddingLeft: 20, paddingTop: 5}}>
                        <Button>
                            VER
                        </Button>
                    </div>
                </Grid>
                <Grid container spacing={1}>
                     <div style={{width: '10%', textAlign: 'left', paddingLeft: 20, paddingTop: 10}}>
                        {<FontAwesomeIcon icon={faCircle} size='2x' color='#F2C94C'/>}
                    </div> 
                    <div style={{width: '40%', textAlign: 'left', paddingLeft: 20}}>
                        <p>
                            En Proceso
                        </p>
                    </div>
                    <div style={{width: '20%', textAlign: 'left', paddingLeft: 20}}>
                        <p>
                            1
                        </p>
                    </div>
                    <div style={{width: '30%', textAlign: 'left', paddingLeft: 20, paddingTop: 5}}>
                        <Button>
                            VER
                        </Button>
                    </div>
                </Grid>
                <Grid container spacing={1}>
                     <div style={{width: '10%', textAlign: 'left', paddingLeft: 20, paddingTop: 10}}>
                        {<FontAwesomeIcon icon={faCircle} size='2x' color='#EB5757'/>}
                    </div> 
                    <div style={{width: '40%', textAlign: 'left', paddingLeft: 20}}>
                        <p>
                            Pendientes
                        </p>
                    </div>
                    <div style={{width: '20%', textAlign: 'left', paddingLeft: 20}}>
                        <p>
                            0
                        </p>
                    </div>
                    <div style={{width: '30%', textAlign: 'left', paddingLeft: 20, paddingTop: 5}}>
                        <Button>
                            VER
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Maitence
