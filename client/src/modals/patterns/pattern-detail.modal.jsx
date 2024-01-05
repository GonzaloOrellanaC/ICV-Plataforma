import { useState, useEffect } from 'react';
import { 
    Box, 
    Modal,
    Toolbar,
    Fab,
    Input,
    TextareaAutosize,
    Grid,
    Button,
    FormControl,

} from '@mui/material';
import { Close } from '@mui/icons-material';
import { styleInternalMessageModal } from '../../config';
import { patternsRoutes } from '../../routes';

const PatternDetailModal = ({open, closeModal, savedInfo}) => {
    const [ type, setType ] = useState('')
    const [ brand, setBrand ] = useState('')
    const [ model, setModel ] = useState('')
    const [ pidpm, setPIDPM ] = useState('')
    const [ zone, setZone ] = useState('')

    useEffect(() => {
        
    }, []);

    const removeData = () => {
        setType('')
        setBrand('')
        setModel('')
        setPIDPM('')
        setZone('')
    }

    const savePattern = async () => {
        const pattern = {
            type: type,
            brand: brand,
            model: model,
            pIDPM: pidpm,
            zone: zone
        }
        const response = await patternsRoutes.savePattern(pattern)
        if (response) {
            closeModalActivate()
            savedInfo()
        }
    }

    const closeModalActivate = () => {
        closeModal();
        removeData()
    }

    const brands = [
        'Caterpillar', 'Komatsu'
    ]

    const types = [
        'Camión', 'Pala', 'Cargador Frontal', 'Bulldozer'
    ]

    const models = [
        '793-F', 'PC5500', '789-D', '994-K', 'D10-T2', 'D10-T'
    ]

    const zones = [
        'Genérico'
    ]
    
    
    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleInternalMessageModal}>
                <Grid container style={{paddingTop: 50}}>
                    <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                        <FormControl style={{width: '100%', paddingRight: 10}}>
                            <p style={{margin: 0, marginTop: 5}}>Marca</p>
                            <select 
                                required 
                                /* onBlur={()=>saveUserData()}  */
                                name="site" 
                                id="site" 
                                style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}}
                                onChange={(e)=> setBrand(e.target.value)}
                                value={brand} 
                                className="inputClass"
                            >
                                <option value={''}>Seleccione...</option>
                                {
                                    brands.map((brand, index) => {
                                        return(
                                            <option key={index} value={brand}>{brand}</option>
                                        )
                                    })
                                }
                            </select>
                        </FormControl>
                    </Grid>
                    <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                        <FormControl style={{width: '100%', paddingRight: 10}}>
                            <p style={{margin: 0, marginTop: 5}}>Tipo</p>
                            <select 
                                required 
                                /* onBlur={()=>saveUserData()}  */
                                name="site" 
                                id="site" 
                                style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}}
                                onChange={(e)=> setType(e.target.value)}
                                value={type} 
                                className="inputClass"
                            >
                                <option value={''}>Seleccione...</option>
                                {
                                    types.map((type, index) => {
                                        return(
                                            <option key={index} value={type}>{type}</option>
                                        )
                                    })
                                }
                            </select>
                        </FormControl>
                    </Grid>
                    <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                        <FormControl style={{width: '100%', paddingRight: 10}}>
                            <p style={{margin: 0, marginTop: 5}}>Modelo</p>
                            <select 
                                required 
                                /* onBlur={()=>saveUserData()}  */
                                name="site" 
                                id="site" 
                                style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}}
                                onChange={(e)=> setModel(e.target.value)}
                                value={model} 
                                className="inputClass"
                            >
                                <option value={''}>Seleccione...</option>
                                {
                                    models.map((model, index) => {
                                        return(
                                            <option key={index} value={model}>{model}</option>
                                        )
                                    })
                                }
                            </select>
                        </FormControl>
                    </Grid>
                    <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                        <FormControl style={{width: '100%', paddingRight: 10}}>
                            <p style={{margin: 0, marginTop: 5}}>Zona</p>
                            <select 
                                required 
                                /* onBlur={()=>saveUserData()}  */
                                name="site" 
                                id="site" 
                                style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}}
                                onChange={(e)=> setZone(e.target.value)}
                                value={zone} 
                                className="inputClass"
                            >
                                <option value={''}>Seleccione...</option>
                                {
                                    zones.map((zone, index) => {
                                        return(
                                            <option key={index} value={zone}>{zone}</option>
                                        )
                                    })
                                }
                            </select>
                        </FormControl>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                        <FormControl style={{width: '100%', paddingRight: 10}}>
                            <p style={{margin: 0, marginTop: 5}}>PIDPM</p>
                            <input 
                                autoComplete="off"
                                required
                                id="rut"
                                className="inputClass"
                                type="text"
                                minLength={11}
                                maxLength={12}
                                /* onBlur={()=>saveUserData()} */
                                onInput={(e)=>setPIDPM(e.target.value)}
                                value={pidpm}
                                placeholder="SPM000111"
                                style={{width: '100%', height: 44, borderRadius: 10, fontSize: 20}}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Button onClick={savePattern}>
                            Guardar Pauta
                        </Button>
                    </Grid>
                </Grid>
                <Fab onClick={()=>closeModalActivate()} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </Box>
        </Modal>
    )
}

export default PatternDetailModal