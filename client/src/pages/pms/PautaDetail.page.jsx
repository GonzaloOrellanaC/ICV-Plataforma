import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { Box, Grid, IconButton, Card, Toolbar } from "@material-ui/core";
import { ArrowBackIos } from '@material-ui/icons'
import { pautasDatabase } from "../../indexedDB"
import { PautaDetail } from '../../containers'
import { useStylesTheme } from '../../config'

const PautaDetailPage = () => {
    const classes = useStylesTheme();
    const [ pauta, setPauta ] = useState()
    const history = useHistory();
    let { id } = useParams();

    useEffect( () => {

        pautasDatabase.initDbPMs().then(async database => {
            let data = await pautasDatabase.obtener(id, database.database)
            if(data) {
                setPauta(data);
            }
        })
    }, [])
    
    return (
        <Box>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <div style={{paddingLeft: 0, }}>
                                        <div style={{float: 'left', width: '100%'}}>
                                            <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10,}}>
                                                <IconButton onClick={() => setTimeout(() => {
                                                    history.goBack()
                                                }, 500)}> 
                                                    <ArrowBackIos style={{color: '#333', fontSize: 16}} /> 
                                                </IconButton> 
                                                <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16, }}> 
                                                {
                                                    pauta && `Listado Pautas / ${pauta.typepm}`
                                                }
                                                </h1>
                                            </Toolbar>
                                            <div style={{height: '90%', width: '98%'}}>
                                                {
                                                    pauta && <PautaDetail pauta={pauta} />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )

}

export default PautaDetailPage