import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Grid, Toolbar, IconButton } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { useStylesTheme } from '../../config'
import { MachineButton } from '../../components/buttons'
import { useHistory } from 'react-router-dom'
import { useAuth, useMachineContext } from '../../context'
const MachinesPage = ({ route }) => {
    const classes = useStylesTheme()
    const {machines} = useMachineContext()
    const history = useHistory();
    const [routeData, setRouteData] = useState()

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
                                            history.goBack()
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <p style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            {`${routeData}`}
                                        </p>
                                    </Toolbar>
                                </div>
                            </div>
                            <Grid container spacing={5} justifyContent='flex-start' style={{textAlign: 'center', height: '75vh', overflowY: 'auto'}}>
                                {
                                    machines.map((machine) => {
                                        return (
                                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} key={machine.id}>
                                                <MachineButton machine={machine} route={route}/>
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

MachinesPage.propTypes = {
    route: PropTypes.oneOf(['machines'])
}

export default MachinesPage
