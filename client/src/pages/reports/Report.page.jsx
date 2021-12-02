import React from 'react'
import { Box, Grid, Card, Button, makeStyles} from '@material-ui/core'

import { useStylesTheme } from '../../config'
import { useLanguage } from '../../context'

import {Inspects, Maitence} from './../../containers'


const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.text.secondary
    }
}));

const ReportsPage = () => {
    const classes = useStylesTheme()
    const { dictionary } = useLanguage();
    let widthElement
    if(document.querySelector('#data')){
        //console.log(document.querySelector('#data').offsetWidth);
        if(document.querySelector('#containerData').offsetWidth) {
            //console.log(document.querySelector('#containerData').offsetWidth);
            widthElement = document.querySelector('#containerData').offsetWidth - document.querySelector('#data').offsetWidth;
            //console.log(widthElement)
            if(widthElement) {
                if(document.querySelector('#title')) {
                    //console.log(document.querySelector('#title').offsetHeight)
                }
            }
        }
    }

    
    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard} >
                        <Grid>
                            <div style={{textAlign: 'left', paddingLeft: 20, width: '100%', borderWidth: 2, borderStyle: 'solid', borderColor: '#000', backgroundColor: 'rgba(255,  255,  255,  0.5)'}}>
                                <h2 style={{marginTop: 10, marginBottom: 10}}>
                                    Reportes
                                </h2>
                            </div>
                        </Grid>
                        <div id="containerData" style={{display: 'block'}}>
                            <Grid style={{margin: 0}} container spacing={1}  >
                                <div id="data" style={{width: 'calc(100%/3.5)'}}>
                                    <Inspects/>
                                    <Maitence/>
                                </div>
                                {widthElement && 
                                    <div id="title"  style={{paddingTop: 20, paddingLeft: 20, width: widthElement}}>
                                        <div style={{padding: 20, width: '100%', borderWidth: 2, borderStyle: 'solid', borderColor: '#000', backgroundColor: 'rgba(255,  255,  255,  0.5)'}}>
                                            <input type="text" placeholder="Buscar" name="search" style={{width: '100%'}} />
                                        </div>
                                        <div style={{marginTop:20, backgroundColor:'#303030', color: '#FFFFFF', paddingLeft: 20, width: '100%'}}>
                                            <h3 style={{margin: 0}}>Inspecciones completadas</h3>
                                        </div>
                                        <div style={{height: '80.5%', borderWidth: 2, borderStyle: 'solid', borderColor: '#000', backgroundColor: 'rgba(255,  255,  255,  0.5)'}}>
                                            
                                        </div>
                                    </div>
                                }
                            </Grid>
                        </div>
                        {/* <Grid container spacing={1} >
                            
                            
                            
                        </Grid> */}
                        
                        
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ReportsPage
