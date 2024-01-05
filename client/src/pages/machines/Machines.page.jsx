import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Grid, Toolbar, IconButton } from '@mui/material'
import { ArrowBackIos } from '@mui/icons-material'
import { useStylesTheme } from '../../config'
import { MachineButton } from '../../components/buttons'
import { useNavigate } from 'react-router-dom'
import { useAuth, useMachineContext } from '../../context'
const MachinesPage = ({ route }) => {
    const classes = useStylesTheme()
    const {machines} = useMachineContext()
    const navigate = useNavigate();
    const [routeData, setRouteData] = useState()

    const urlImagenes = 'https://icvmantencion.blob.core.windows.net/plataforma-mantencion/maquinas/imagenes/'

    useEffect(() => {
        if(route === 'inspection') {
            setRouteData('Inspección')
        }else if(route === 'maintenance') {
            setRouteData('Mantención')
        }else if(route === 'machines') {
            setRouteData('Máquinas')
        }
    },[route])

    return (
        <Box height='90%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <div className={'pageCard'}>
                        <Grid container alignItems='flex-start' justifyContent='flex-start'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10,}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            navigate(-1)
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <p style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            {`${routeData}`}
                                        </p>
                                    </Toolbar>
                                </div>
                            </div>
                            <Grid container spacing={5} justifyContent='flex-start' style={{textAlign: 'center', /* height: '75vh',  */overflowY: 'auto'}}>
                                {
                                    machines.map((machine, index) => {
                                        return (
                                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4} key={machine.id}>
                                                {/* <MachineButton machine={machine} route={route}/> */}
                                                <BotonMaquina machine={machine} route={route} key={index} navigate={navigate} />
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </Box>
    )
}

const BotonMaquina = ({machine, route, navigate}) => {
    const newMachine = {
        brand: machine.brand,
        id: machine.id,
        model: machine.model,
        pIDPM: machine.pIDPM,
        type: machine.type
    }
    return (
        <button className='botonMaquinaContainer' onClick={()=>{navigate(`/${route}/${JSON.stringify(newMachine)}`)}}>
{/*             <Grid container style={{width: '100%'}}>
                <Grid item sm={4} md={4} lg={4} xl={4}> */}
                    <div style={{backgroundColor: '#fff'}} className='imagenBotonMaquina'>
                        {machine.image.data && <img src={`data:${machine.image.data}`} width={'100%'} />}
                    </div>
{/*                 </Grid>
                <Grid item sm={8} md={8} lg={8} xl={8}> */}
                    <div className='textoBotonMaquinaContainer'>
                        <p><strong>{`${machine.type}`}</strong></p>
                        <p>{`${machine.brand} ${machine.model}`}</p>
                    </div>
{/*                 </Grid>
            </Grid> */}
        </button>
    )
}

MachinesPage.propTypes = {
    route: PropTypes.oneOf(['machines'])
}

export default MachinesPage
