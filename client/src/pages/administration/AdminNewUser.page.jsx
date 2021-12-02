import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Grid, Toolbar, IconButton, Button, Modal,  Fab } from '@material-ui/core'
import { ArrowBackIos, Close } from '@material-ui/icons'
import { useStylesTheme } from '../../config'
import { CreateUser, PermissionUser } from '../../containers'
import { useHistory } from 'react-router-dom'
import { useLanguage } from '../../context'

const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: 20,
    boxShadow: 24,
    p: 4,
};

const AdminNewUserPage = () => {
    const classes = useStylesTheme();
    const history = useHistory();
    const [open, setOpen] = useState(false);

    const [ usageModule, setUsageModule ] = useState(0)

    const openCloseModal = () => {
        let answer
        if(open) {
            answer = false
        }else{
            answer = true
        }
        setTimeout(() => {
            setOpen(answer)
        }, 500);
    }

    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
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
                                            Administración / Administrar usuarios / Nuevo usuario
                                        </h1>
                                    </Toolbar>
                                </div>
                            </div>
                        </Grid>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                {
                                    (usageModule === 0) &&
                                        <CreateUser height={100} />
                                }
                                {   (usageModule === 1) &&
                                        <PermissionUser height={100} />
                                }
                                
                                <div style={{position: 'absolute', right: 40, bottom: 40}}>
                                    <div style={{width: "100%"}}>
                                        <div style={{float: 'right'}}>
                                        <button style={{width: 189, height: 48, borderRadius: 23, marginRight: 17, fontSize: 20, color: '#BB2D2D', borderColor: '#BB2D2D', borderWidth: 2}}>
                                            Cancelar
                                        </button>
                                        {
                                            usageModule == 0 &&
                                                <button onClick={()=>{setUsageModule(usageModule + 1)}} style={{width: 189, height: 48, borderRadius: 23, fontSize: 20, color: '#fff',  backgroundColor: '#BB2D2D', borderColor: '#BB2D2D'}}>
                                                    Siguiente
                                                </button>
                                        }
                                        {
                                            usageModule > 0 &&
                                                <button onClick={()=>{openCloseModal()}} style={{width: 189, height: 48, borderRadius: 23, fontSize: 20, color: '#fff',  backgroundColor: '#BB2D2D', borderColor: '#BB2D2D'}}>
                                                    Crear usuario
                                                </button>
                                        }
                                        
                                        </div>
                                    </div> 
                                </div>
                            </div>     
                        </Grid>
                        <div>
                            <Modal
                                open={open}
                                //close={!open}
                                //onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={styleModal}>
                                    <div style={{textAlign: 'center'}}>
                                        <img src="../../assets/icons/check-green.svg" alt="" />
                                        <h1>Usuario creado con éxito</h1>
                                    </div>
                                    <Fab onClick={openCloseModal} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                                        <Close style={{color: '#ccc'}} />
                                    </Fab>
                                </Box>
                                
                            </Modal>
                        </div>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default AdminNewUserPage