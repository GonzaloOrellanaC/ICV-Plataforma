import { Grid } from '@material-ui/core'

const PatternList = ({patterns}) => {
    return (
        <div style={{ padding: 10, width: '80%', height: 'calc(100vh - 250px)', textAlign: 'left', color: '#333', backgroundColor: '#F9F9F9', borderRadius: 20 }}>
            <Grid container>
                <Grid item xl={1} lg={1}>
                    <strong>ID</strong>
                </Grid>
                <Grid item xl={2} lg={2}>
                    <strong>Tipo</strong>
                </Grid>
                <Grid item xl={1} lg={1}>
                    <strong>Marca</strong>
                </Grid>
                <Grid item xl={1} lg={1}>
                    <strong>Modelo</strong>
                </Grid>
                <Grid item xl={1} lg={1}>
                    <strong>PIDPM</strong>
                </Grid>
                <Grid item xl={1} lg={1}>
                    <strong>Zona</strong>
                </Grid>
            </Grid>
            {
                (patterns.length === 0)
                ?
                <div style={{ width: '100%', textAlign: 'left', paddingTop: 50 }}>
                    No hay pautas creadas
                </div>
                :
                <div style={{ width: '100%', paddingTop: 50, height: 'calc(100vh - 400px)', overflowY: 'auto' }}>
                    {
                        patterns.map((pattern, i) => {
                            return (
                                <Grid container key={i} style={{ paddingTop: (i === 0) ? 0 : 10, paddingBottom: 10 }}>
                                    <Grid item xl={1} lg={1}>
                                        {pattern.idPattern}
                                    </Grid>
                                    <Grid item xl={2} lg={2}>
                                        {pattern.type}
                                    </Grid>
                                    <Grid item xl={1} lg={1}>
                                        {pattern.brand}
                                    </Grid>
                                    <Grid item xl={1} lg={1}>
                                        {pattern.model}
                                    </Grid>
                                    <Grid item xl={1} lg={1}>
                                        {pattern.pIDPM}
                                    </Grid>
                                    <Grid item xl={1} lg={1}>
                                        {pattern.zone}
                                    </Grid>
                                </Grid>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

export default PatternList
