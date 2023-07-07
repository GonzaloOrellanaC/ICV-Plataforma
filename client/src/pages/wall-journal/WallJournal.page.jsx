import React, { useEffect, useState } from 'react'
import { Box, IconButton, Toolbar } from "@material-ui/core"
import { ArrowBackIos } from "@material-ui/icons"
import { Grid } from "swiper"
import { useNavigate } from 'react-router-dom'

const WallJournalPage = () => {
    const navigate = useNavigate()
    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid style={{flexShrink: 0}}>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            navigate(-1)
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <p style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Administración Mural
                                        </p>
                                    </Toolbar>
                                </div>
                            </div>
                        </Grid>
                        <Grid container spacing={1} style={{padding: '5px 10px 0px 10px'}}>
                            <h1>
                                HELLO!!
                            </h1>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default WallJournalPage