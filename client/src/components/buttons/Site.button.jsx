import React from 'react'
import { Grid, Button } from '@mui/material'

const SiteButton = ({ site }) => {

    const seleccionarSitio = () => {
        localStorage.setItem('sitio', JSON.stringify(site));
        alert(site.descripcion+' seleccionado.')
    }

    return (
        <Grid container style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#505050', borderRadius:20, padding: 20}}>
            <div style={{margin: 'auto', textAlign: 'left'}}>
                <h1> {site.descripcion} </h1>
            </div>
            <div style={{position: 'relative', right: 20, margin: 'auto', marginRight: 80, maxWidth: 50, textAlign: 'right'}}>
                <Button onClick={seleccionarSitio} style={{borderStyle: 'solid', borderWidth: 2, backgroundColor: '#BE2E26', borderColor: '#BE2E26', color: '#FFF', borderRadius:20, padding: 20}}>Seleccionar</Button>
            </div>
        </Grid>
    )
}

export default SiteButton