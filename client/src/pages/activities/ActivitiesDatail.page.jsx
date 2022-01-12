import React, { useState, useEffect } from 'react'
import { Box, Card, Grid, Toolbar, IconButton } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { useStylesTheme } from '../../config'
import { useHistory, useParams } from 'react-router-dom'
import { pautasDatabase, executionReportsDatabase } from '../../indexedDB'
import { PautaDetail } from '../../containers'

const ActivitiesDetailPage = () => {
    const classes = useStylesTheme();
    const history = useHistory();
    const {id} = useParams();
    const [ pauta, setPauta ] = useState();
    const [ executionReport, setExecutionReport ] = useState()

    useEffect(() => {
        getPauta()
    }, [])

    const getPauta = async () => {
        let db = await pautasDatabase.initDbPMs();
        if(db) {
            let pautaIdpm = getIdpm(JSON.parse(id).getMachine.model);
            let pautas = await pautasDatabase.consultar(db.database);
            if(pautas) {
                let pautaFiltered = pautas.filter((info) => {if((info.typepm === JSON.parse(id).guide)&&(pautaIdpm===info.idpm)) {return info}});
                let exDb = await executionReportsDatabase.initDb();
                if( exDb ) {
                    let responseDatabase = await executionReportsDatabase.consultar(exDb.database);
                    if( responseDatabase ) {
                        let executionReportResponse = responseDatabase.filter((res) => { if(JSON.parse(id)._id === res.reportId) {return res}})
                        setExecutionReport(executionReportResponse[0])
                    }
                }
                setPauta(pautaFiltered[0]);
            }
        }
    }

    const getIdpm = (model) => {
        if(model === '793-F') {
            return 'SPM000787';
        }else if(model === 'PC5500') {
            return 'SPM000445'
        }
    }

    return (
        <Box height='80vh'>
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
                                            Actividades Asignadas / Detalle
                                        </h1>
                                    </Toolbar>
                                </div>
                            </div>
                            <div style={{width: '98%'}}>
                                {
                                    pauta && <PautaDetail height={'calc(100vh - 300px)'} pauta={pauta} executionReport={executionReport} />
                                }
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ActivitiesDetailPage