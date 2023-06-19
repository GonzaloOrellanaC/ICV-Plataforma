import React, { useState, useEffect } from 'react'
import { Box, Card, Grid, Toolbar, IconButton } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { useStylesTheme } from '../../config'
import { useNavigate } from 'react-router-dom'
import { patternsRoutes } from '../../routes'
import {  PatternDetailModal } from '../../modals';
import { PatternList } from '../../containers/patterns-list'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { LoadingLogoDialog } from '../../dialogs'

const PatternsPage = ({roles}) => {
    const classes = useStylesTheme();
    const navigate = useNavigate();
    const [ openLoader, setOpenLoader ] = useState(false);
    const [ patterns, setPatterns ] = useState([])
    const [ openPatternModal, setOpenPatternModal ] = useState(false)
    useEffect(() => {
        init()
    },[])
    const init = async () => {
        const response = await patternsRoutes.getPatterns()
        setPatterns(response.data)
    }

    const closePatternModal = () => {
        setOpenPatternModal(false)
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
                                            Administración / Pautas
                                        </h1>
                                        <button 
                                            /* hidden={!hableCreateReport} */
                                            onClick={()=>{setOpenPatternModal(true)}}
                                            title='Nueva pauta' 
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
                                            <FontAwesomeIcon icon={faClipboardList} style={{marginRight: 10}}/> Nueva pauta
                                        </button>
                                    </Toolbar>
                                </div>
                            </div>
                        </Grid>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10, overflowY: 'auto', height: 'calc(100vh - 195px)'}}>
                                <PatternList patterns={patterns}/>
                            </div>
                        </Grid>
                        <div>
                            <LoadingLogoDialog open={openLoader} />
                            <PatternDetailModal open={openPatternModal} savedInfo={init} closeModal={closePatternModal} />
                        </div>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default PatternsPage