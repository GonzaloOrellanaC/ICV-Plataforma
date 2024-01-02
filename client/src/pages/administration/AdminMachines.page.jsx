import React, { useEffect, useState } from 'react'
import { Box, Card, Grid, Toolbar, IconButton } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { useStylesTheme } from '../../config'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTruck } from '@fortawesome/free-solid-svg-icons'
import { useMachineContext } from '../../context'
import NuevaMaquinaDialog from '../../dialogs/NuevaMaquinaDialog'

const MachinesAdminPage = ({roles}) => {
    const {machines, nuevaMaquina} = useMachineContext()
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const classes = useStylesTheme();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(machines)
    }, [machines])

    const abrirNuevaMaquina = () => {
        setOpen(true)
    }

    const onClose = () => {
        setOpen(false)
    }

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
                                            navigate(-1);
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Administración / Máquinas
                                        </h1>
                                        <button 
                                            /* hidden={!hableCreateReport} */
                                            onClick={()=>{abrirNuevaMaquina()}}
                                            title='Nueva máquina' 
                                            style={
                                                {
                                                    position: 'absolute', 
                                                    right: 10, 
                                                    color: '#fff',
                                                    backgroundColor: '#be2e26',
                                                    paddingTop: 10,
                                                    paddingBottom: 10,
                                                    paddingLeft: 20,
                                                    paddingRight: 20,
                                                    borderRadius: 20,
                                                    borderColor: 'transparent'
                                                }
                                            }
                                        >
                                            <FontAwesomeIcon icon={faTruck} style={{marginRight: 10}}/> Nueva Máquina
                                        </button>
                                    </Toolbar>
                                </div>
                            </div>
                        </Grid>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', height: 60, fontSize: 20, borderBottom: '1px solid #ccc', marginLeft: 10}}>
                                <Grid container>
                                    <Grid item xl={'auto'}>
                                        <p style={{width: 30, marginTop: 30, marginBottom: 30, marginLeft: 10}}>ID</p>
                                    </Grid>
                                    <Grid item xl={1}>
                                        <p style={{marginTop: 30, marginBottom: 30}}>Tipo</p>
                                    </Grid>
                                    <Grid item xl={1}>
                                        <p style={{marginTop: 30, marginBottom: 30}}>Marca</p>
                                    </Grid>
                                    <Grid item xl={1}>
                                        <p style={{marginTop: 30, marginBottom: 30}}>Modelo</p>
                                    </Grid>
                                    <Grid item xl={1}>
                                        <p style={{marginTop: 30, marginBottom: 30}}>Imágen</p>
                                    </Grid>
                                    <Grid item xl={1}>
                                        <p style={{marginTop: 30, marginBottom: 30}}>Acciones</p>
                                    </Grid>
                                </Grid>
                            </div>
                            <div style={{width: '100%', textAlign: 'left', padding: 10, overflowY: 'auto', height: 'calc(100vh - 270px)', fontSize: 15}}>
                                {
                                    machines.map((machine, i) => {
                                        return (
                                            <Grid container key={i}>
                                                <Grid item xl={'auto'}>
                                                    <p style={{width: 30, marginTop: 30, marginBottom: 30, marginLeft: 10}}>{machine.machineId}</p>
                                                </Grid>
                                                <Grid item xl={1}>
                                                    <p style={{marginTop: 30, marginBottom: 30}}>{machine.type}</p>
                                                </Grid>
                                                <Grid item xl={1}>
                                                    <p style={{marginTop: 30, marginBottom: 30}}>{machine.brand}</p>
                                                </Grid>
                                                <Grid item xl={1}>
                                                    <p style={{marginTop: 30, marginBottom: 30}}>{machine.model}</p>
                                                </Grid>
                                                <Grid item xl={1}>
                                                    {machine.image && machine.image.data && <img src={`data:${machine.image.data}`} width={100} />}
                                                </Grid>
                                                <Grid item xl={3}>
                                                    <Grid container>
                                                        <Grid item >
                                                            <button className='editarBoton' style={{marginTop: 30}}>
                                                                Editar
                                                            </button>
                                                        </Grid>
                                                        <Grid item style={{marginLeft: 10}}>
                                                            <button className='borrarBoton' style={{marginTop: 30}}>
                                                                Borrar
                                                            </button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        )
                                    })
                                }
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            {
                open && <NuevaMaquinaDialog open={open} close={onClose} nuevaMaquina={nuevaMaquina} />
            }
        </Box>
    )
}

export default MachinesAdminPage