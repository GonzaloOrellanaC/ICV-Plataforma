import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Grid } from '@material-ui/core'

import { useStylesTheme } from '../../config'
import { MachineButton } from '../../components/buttons'
//import machineImg1 from '../../assets/machineexample1.png'
//import machineImg2 from '../../assets/machineexample2.png'
//import machineImg3 from '../../assets/machineexample3.png'
import machineImg1 from '../../assets/793F.png'
import machineImg2 from '../../assets/PC5500.png'
import machineImg3 from '../../assets/logo_icv.png'
/* import { FilterField } from '../../components/fields' */
import { useLanguage } from '../../context'

const MachinesPage = ({ route }) => {
    const classes = useStylesTheme()
    const { dictionary } = useLanguage()
    const machinesList = [
        {
            id: 0,
            model: '793F',
            type: 'Camión',
            brand: 'Caterpillar'
        },
        {
            id: 1,
            model: 'PC5500',
            type: 'Pala',
            brand: 'Komatsu'
        }
    ]
    /* const [filter, setFilter] = useState('') */

    /* const handleFilter = (event) => {
        setFilter(event.target.value)
    } */

    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', color: '#fff' }}>
                                <h1 style={{marginTop: 0}}>Inspección </h1>
                            </div>
                            {/* <Grid item xs={12}>
                                <div className={classes.pageTitle}>
                                    {dictionary.machines.title}
                                </div>
                            </Grid> */}
                            <Grid container item spacing={5} justifyContent='center'>
                                {
                                    machinesList.filter(a => a.toString()).map((machine) => {
                                    //[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(a => a.toString().includes(filter)).map((number) => {
                                        /* const imgNumber = number % 3 + 1
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
                                        } */
                                        return (
                                            <Grid item key={machine.id}>
                                                <MachineButton machine={machine} image={`/assets/${machine.model}.png`} route={route}/>
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

MachinesPage.propTypes = {
    route: PropTypes.oneOf(['inspection', 'maintenance'])
}

export default MachinesPage
