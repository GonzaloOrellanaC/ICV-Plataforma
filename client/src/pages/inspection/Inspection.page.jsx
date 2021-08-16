import React from 'react'
import { Box, Card, Grid } from '@material-ui/core'
import { useStylesTheme } from '../../config'
import { MachineButton } from '../../components/buttons'
import machineImg1 from '../../assets/machineexample1.png'
import machineImg2 from '../../assets/machineexample2.png'
import machineImg3 from '../../assets/machineexample3.png'

const InspectionPage = () => {
    const classes = useStylesTheme()
    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <Grid container style={{ height: '100%' }} alignItems='center' justifyContent='center'>
                            <Grid container item spacing={5} justifyContent='center'>
                                {
                                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => {
                                        const imgNumber = number % 3 + 1
                                        let img = null
                                        switch (imgNumber) {
                                        case 1:
                                            img = machineImg1
                                            break
                                        case 2:
                                            img = machineImg2
                                            break
                                        case 3:
                                            img = machineImg3
                                            break
                                        }
                                        return (
                                            <Grid item key={number}>
                                                <MachineButton text={`NOMBRE TIPO MODELO y código ${number}`} image={img}/>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default InspectionPage
