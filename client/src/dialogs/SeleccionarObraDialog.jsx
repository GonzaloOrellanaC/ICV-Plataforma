import {Dialog, DialogTitle, DialogContent, TextField, Button, ListItemButton} from '@mui/material';
import { useEffect, useState } from 'react';
import { usersRoutes } from '../routes';
import { useAuth, useReportsContext, useSitesContext } from '../context';
import { ListItemText } from '@mui/material';

const SeleccionarObraDialog = ({open, handleClose}) => {

    const {sites} = useSitesContext()
    const {setSiteSelected} = useReportsContext()
    const [obras, setObras] = useState([])

    useEffect(() => {
        if (sites.length > 0) {
            setObras(sites.filter(site => {if (site.status) return site}))
            console.log(sites)
        }
    }, [sites])

    /* const seleccionarObra = () => {

    } */

    return(
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Seleccione Obra</DialogTitle>
            <DialogContent>
                    <ListItemButton onClick={() => {setSiteSelected('none'); setTimeout(() => {
                        handleClose('Selected')
                    }, 500);}}>
                        <ListItemText primary={'Todas las obras'}/>
                    </ListItemButton>
                    {
                        obras.map((obra, i)=>{
                            return (
                                <ListItemButton key={i} onClick={() => {setSiteSelected(obra.idobra); setTimeout(() => {
                                    handleClose('Selected')
                                }, 500)}}>
                                    <ListItemText primary={obra.descripcion}/>
                                </ListItemButton>
                            )
                        })
                    }
                {/* <Button style={{background: 'brown', color: 'white', marginBottom: 30}} fullWidth onClick={seleccionarObra}>
                    Guardar
                </Button>
                <Button style={{background: 'red', color: 'white'}} fullWidth onClick={handleClose}>
                    Cancelar
                </Button> */}
            </DialogContent>
        </Dialog>
    )
}

export default SeleccionarObraDialog