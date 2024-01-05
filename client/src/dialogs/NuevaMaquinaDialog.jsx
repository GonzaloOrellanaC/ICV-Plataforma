import { Dialog, Fab } from "@mui/material"
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const NuevaMaquinaDialog = ({open, close, isEdit, nuevaMaquina}) => {
    const [tipo, setTipo] = useState()

    useEffect(() => {
        console.log(tipo)
    },[tipo])

    return(
        <Dialog
            open={open}
            maxWidth={'xl'}
            adaptiveHeight={true}
        >
            <div style={{ width: 800, padding: 10}} >
                <h1>{isEdit ? `Edite ` : `Nueva `} máquina</h1>
                <div style={{width: '100%', overflowY: 'auto', height: 'calc(100vh - 300px)'}}>
                
                <FormControl fullWidth>
                    <InputLabel>Tipo:</InputLabel>
                    <Select
                        onChange={(e)=>{setTipo(e.target.value)}}
                        label="Tipo:"
                    >
                        <MenuItem style={{fontSize: 15}} >
                            Camión
                        </MenuItem>
                        <MenuItem style={{fontSize: 15}} >
                            Pala
                        </MenuItem>
                        <MenuItem style={{fontSize: 15}} >
                            Cargador Frontal
                        </MenuItem>
                        <MenuItem style={{fontSize: 15}} >
                            Bulldozer
                        </MenuItem>  
                        <MenuItem style={{fontSize: 15}} >
                            Grupos Electrogenos
                        </MenuItem>  
                        <MenuItem style={{fontSize: 15}} >
                            Bulldozer
                        </MenuItem>  
                        <MenuItem style={{fontSize: 15}} >
                            Bulldozer
                        </MenuItem>  
                        <MenuItem style={{fontSize: 15}} >
                            Bulldozer
                        </MenuItem>                        
                    </Select>
                </FormControl>
                    <button onClick={nuevaMaquina}>
                        Guardar
                    </button>
                </div>
                <Fab onClick={()=>close()} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </div>
        </Dialog>
    )
}

export default NuevaMaquinaDialog