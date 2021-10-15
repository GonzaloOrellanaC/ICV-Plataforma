import React, { useState } from 'react'
//import PropTypes from 'prop-types'
import { Box, Card, Grid, makeStyles } from '@material-ui/core'

import { useStylesTheme } from '../../config'
import { FilterField } from '../../components/fields'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        border: '5px solid gray',
        borderRadius: 0,
        boxShadow: 'none'
    },
    fichaText: {
        fontSize: '1.2rem',
        color: theme.palette.primary.main
    },
    name: {
        fontWeight: 'bold'
    }
}))

const DivisionsPage = () => {
    const classes = useStylesTheme()
    const localClasses = useStyles()
    const [filter, setFilter] = useState('')

    const handleFilter = (event) => {
        setFilter(event.target.value)
    }

    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <Grid container item xs={12} justifyContent='flex-end'>
                                <FilterField value={filter} onChange={handleFilter}/>
                            </Grid>
                            <Grid item xs={12}>
                                <div className={classes.pageTitle}>
                                    DIVISIONES
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <Card className={localClasses.root}>
                                    <Grid container item alignContent='center' spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <div className={clsx(localClasses.name, localClasses.fichaText)}>NOMBRE TIPO</div>
                                            <div className={localClasses.fichaText}>MODELO</div>
                                            <div className={localClasses.fichaText}>INFORMACIÓN</div>
                                            <div className={localClasses.fichaText}>ÚLTIMA INSPECCIÓN</div>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <div style={{ height: 120, width: '100%' }}></div>
                                        </Grid>
                                    </Grid>
                                </Card>
                                {/* <Card className={localClasses.root}>
                                </Card> */}
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

/* ProjectsPage.propTypes = {
    route: PropTypes.oneOf(['inspection', 'maintenance'])
} */

export default DivisionsPage