import { Box, Card, Grid } from '@mui/material'
import { useStylesTheme } from '../../config'



const UserPage = () => {
    const classes = useStylesTheme();


    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid container style={{ height: '100%' }} alignItems='center' justifyContent='center'>
                            
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default UserPage