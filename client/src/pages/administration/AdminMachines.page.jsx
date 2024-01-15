import React, { useEffect, useState } from 'react'
import { Box, Card, Grid, Toolbar, IconButton } from '@mui/material'
import { ArrowBackIos } from '@mui/icons-material'
import { useStylesTheme } from '../../config'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTruck } from '@fortawesome/free-solid-svg-icons'
import { useMachineContext } from '../../context'
import NuevaMaquinaDialog from '../../dialogs/NuevaMaquinaDialog'

const MachinesAdminPage = ({roles}) => {
    const {machines, nuevaMaquina, tipoMaquinas, sumarTipoMaquina, marcasMaquinas, sumarMarcaMaquina, modelosMaquinas, sumarModeloMaquina} = useMachineContext()
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [nuevoTipoMaquina, setNuevoTipoMaquina] = useState('')
    const [nuevaMarcaMaquina, setNuevaMarcaMaquina] = useState('')
    const [nuevoModeloMaqina, setNuevoModeloMaquina] = useState('')
    const [nuevoModeloMarcaMaqina, setNuevoModeloMarcaMaquina] = useState('')
    const classes = useStylesTheme();
    const navigate = useNavigate();

    useEffect(() => {
        scrollingBottomTiposMaquinas()
        scrollingBottomMarcasMaquinas()
        scrollingBottomModelosMaquinas()
    }, [])

    const abrirNuevaMaquina = () => {
        setOpen(true)
    }

    const onClose = () => {
        setOpen(false)
    }

    const scrollingBottomTiposMaquinas = () => {
        const element = document.getElementById('tiposMaquinas')
        element.scrollTop = element.scrollHeight
    }

    const scrollingBottomMarcasMaquinas = () => {
        const element = document.getElementById('marcasMaquinas')
        element.scrollTop = element.scrollHeight
    }

    const scrollingBottomModelosMaquinas = () => {
        const element = document.getElementById('modelosMaquinas')
        element.scrollTop = element.scrollHeight
    }

    const nuevoTipo = async () => {
        if (nuevoTipoMaquina.length > 0) {
            if (confirm(`Se agregará el tipo ${nuevoTipoMaquina.toUpperCase()}`)) {
                const response = await sumarTipoMaquina(nuevoTipoMaquina)
                if (response) {
                    setNuevoTipoMaquina('')
                    scrollingBottomTiposMaquinas()
                }
            }
        }
    }

    const nuevaMarca = async () => {
        if (nuevaMarcaMaquina.length > 0) {
            if (confirm(`Se agregará marca ${nuevaMarcaMaquina.toUpperCase()}`)) {
                const response = await sumarMarcaMaquina(nuevaMarcaMaquina)
                if (response) {
                    setNuevaMarcaMaquina('')
                    scrollingBottomMarcasMaquinas()
                }
            }
        }
    }

    const nuevoModelo = async () => {
        if ((nuevoModeloMaqina.length > 0) && (nuevoModeloMarcaMaqina.length > 0)) {
            if (confirm(`Se agregará modelo ${nuevoModeloMaqina.toUpperCase()} de marca ${marcaDesdeId(nuevoModeloMarcaMaqina)}`)) {
                const response = await sumarModeloMaquina(nuevoModeloMarcaMaqina, nuevoModeloMaqina)
                if (response) {
                    setNuevoModeloMaquina('')
                    setNuevoModeloMarcaMaquina('')
                    scrollingBottomModelosMaquinas()
                }
            }
        }
    }

    const marcaDesdeId = (id) => {
        const value = marcasMaquinas.filter(m => {if (id === m._id) return m})
        if (value.length > 0) {
            return value[0].marca
        } else {
            return null
        }
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
                        <Grid container justifyContent='center'>
                            <Grid item xl={5}>
                                <div style={{width: '100%', textAlign: 'left', height: 60, fontSize: 20, borderBottom: '1px solid #ccc', marginLeft: 10}}>
                                    <Grid container>
                                        <Grid item xl={'auto'}>
                                            <p style={{width: 30, marginTop: 30, marginBottom: 30, marginLeft: 10}}>ID</p>
                                        </Grid>
                                        <Grid item xl={2}>
                                            <p style={{marginTop: 30, marginBottom: 30}}>Tipo</p>
                                        </Grid>
                                        <Grid item xl={2}>
                                            <p style={{marginTop: 30, marginBottom: 30}}>Marca</p>
                                        </Grid>
                                        <Grid item xl={2}>
                                            <p style={{marginTop: 30, marginBottom: 30}}>Modelo</p>
                                        </Grid>
                                        <Grid item xl={2}>
                                            <p style={{marginTop: 30, marginBottom: 30}}>Imágen</p>
                                        </Grid>
                                        <Grid item xl={2}>
                                            <p style={{marginTop: 30, marginBottom: 30}}>Acciones</p>
                                        </Grid>
                                    </Grid>
                                </div>
                                <div style={{width: '100%', textAlign: 'left', padding: '10px 0px 0px 10px', overflowY: 'auto', height: 'calc(100vh - 270px)', fontSize: 15}}>
                                    {
                                        machines.map((machine, i) => {
                                            return (
                                                <Grid container key={i} style={{borderBottom: '1px solid #ccc'}}>
                                                    <Grid item xl={'auto'}>
                                                        <p style={{width: 30, marginTop: 30, marginBottom: 30, marginLeft: 10}}>{machine.machineId}</p>
                                                    </Grid>
                                                    <Grid item xl={2}>
                                                        <p style={{marginTop: 30, marginBottom: 30}}>{machine.type}</p>
                                                    </Grid>
                                                    <Grid item xl={2}>
                                                        <p style={{marginTop: 30, marginBottom: 30}}>{machine.brand}</p>
                                                    </Grid>
                                                    <Grid item xl={2}>
                                                        <p style={{marginTop: 30, marginBottom: 30}}>{machine.model}</p>
                                                    </Grid>
                                                    <Grid item xl={2}>
                                                        {machine.image && machine.image.data && <img src={`data:${machine.image.data}`} width={100} />}
                                                    </Grid>
                                                    <Grid item xl={2}>
                                                        <Grid container>
                                                            <Grid item style={{marginLeft: 10, marginTop: 10}}>
                                                                <button className='editarBoton' /* style={{marginTop: 30}} */>
                                                                    Editar
                                                                </button>
                                                            </Grid>
                                                            <Grid item style={{marginLeft: 10, marginTop: 10}}>
                                                                <button className='borrarBoton' /* style={{marginTop: 30}} */>
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
                            <Grid item xl={7}>
                                <Grid container style={{height: '68.5vh'}} spacing={2}>
                                    <Grid item xl={5}>
                                        <div style={{height: '40%', width: '100%', padding: 10, margin: 10, border: '1px solid #ccc' }}>
                                            <h3 style={{margin:0}}>Tipo de máquinas</h3>
                                            <div id={'tiposMaquinas'} style={{flexDirection: 'column-reverse', height: '80%', overflowY: 'auto'}}>
                                                {
                                                    tipoMaquinas.map((machine, i) => {
                                                        return (
                                                            <div key={i} style={{borderBottom: '1px #ccc solid', width: '100%'}}>
                                                                {machine.tipo}
                                                            </div>
                                                        )
                                                    })
                                                }
                                                <p style={{margin:0}}><input placeholder='Agregue nuevo tipo' value={nuevoTipoMaquina} onChange={(e) => {setNuevoTipoMaquina(e.target.value)}} /> <button onClick={nuevoTipo}>Agregar</button></p>
                                            </div>
                                        </div>
                                        <div style={{height: '40%', width: '100%', padding: 10, margin: 10, border: '1px solid #ccc'}}>
                                            <h3 style={{margin:0}}>Marcas de máquinas</h3>
                                            <div id={'marcasMaquinas'} style={{flexDirection: 'column-reverse', height: '80%', overflowY: 'auto'}}>
                                                {
                                                    marcasMaquinas.map((marca, i) => {
                                                        return (
                                                            <div key={i} style={{borderBottom: '1px #ccc solid', width: '100%'}}>
                                                                {marca.marca}
                                                            </div>
                                                        )
                                                    })
                                                }
                                                <p style={{margin:0}}><input placeholder='Agregue nueva marca' value={nuevaMarcaMaquina} onChange={(e) => {setNuevaMarcaMaquina(e.target.value)}} /> <button onClick={nuevaMarca}>Agregar</button></p>
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item xl={7}>
                                        <div style={{height: 'calc(80% + 10px)', width: '100%', padding: 10, margin: 10, border: '1px solid #ccc' }}>
                                            <h3 style={{margin:0}}>Modelos de máquinas</h3>
                                            <div id={'modelosMaquinas'} style={{flexDirection: 'column-reverse', height: '40vh', overflowY: 'auto'}}>
                                                {
                                                    modelosMaquinas.map((modelo, i) => {
                                                        return (
                                                            <Grid key={i} style={{borderBottom: '1px #ccc solid', width: '100%'}} container>
                                                                <Grid item xl={3}>
                                                                    <p style={{margin: 0}}>{modelo.modelo}</p>
                                                                </Grid>
                                                                <Grid item xl={3}>
                                                                    <p style={{margin: 0}}>{modelo.marca.marca}</p>
                                                                </Grid>
                                                            </Grid>
                                                        )
                                                    })
                                                }
                                                <p style={{margin:0}}>
                                                    <input placeholder='Agregue nuevo modelo' value={nuevoModeloMaqina} onChange={(e) => {setNuevoModeloMaquina(e.target.value.toUpperCase())}} />
                                                    <select style={{marginLeft: 5, marginRight: 5, padding: '1px 2px'}} value={nuevoModeloMarcaMaqina} onChange={(e) => {setNuevoModeloMarcaMaquina(e.target.value)}}>
                                                        <option value={''}>
                                                            Selecione marca
                                                        </option>
                                                        {
                                                            marcasMaquinas.map((marca, i) => {
                                                                return (
                                                                    <option key={i} value={marca._id}>
                                                                        {marca.marca}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    <button onClick={nuevoModelo}>Agregar</button></p>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            {
                open && <NuevaMaquinaDialog open={open} close={onClose} nuevaMaquina={nuevaMaquina} marcasMaquinas={marcasMaquinas} tipoMaquinas={tipoMaquinas} modelosMaquinas={modelosMaquinas} />
            }
        </Box>
    )
}

export default MachinesAdminPage