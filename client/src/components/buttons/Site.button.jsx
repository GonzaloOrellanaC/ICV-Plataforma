import React, { useState } from 'react'
import { Grid, Button, Snackbar, IconButton,  } from '@material-ui/core'
import { Close } from '@material-ui/icons';

const SiteButton = ({ site }) => {

    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

    const seleccionarSitio = () => {
        localStorage.setItem('sitio', JSON.stringify(site));
        /* setOpen(true) */
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
            {/* <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                message={`${site.descripcion} seleccionado`}
                action={
                    <React.StrictMode>
                        <Button color="secondary" size="small" onClick={handleClose}>
                            UNDO
                        </Button>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    </React.StrictMode>
                }
                /> */}
        </Grid>
    )
}

export default SiteButton