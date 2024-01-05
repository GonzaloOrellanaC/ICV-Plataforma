import { useState, useEffect } from 'react';
import { 
    Box, 
    Modal,
    Fab,
    Grid,
    Button,
    FormControl,

} from '@mui/material';
import { Close } from '@mui/icons-material';
import { styleInternalMessageModal } from '../../config';
import { patternsRoutes } from '../../routes';
import { pautasDatabase } from '../../indexedDB'

const PatternsDownloadedModal = ({open, closeModal}) => {
    const [ patterns, setPatterns ] = useState([])

    useEffect(() => {
        init()
    }, []);

    const init = async () => {
        const db = await pautasDatabase.initDbPMs()
        const pautas = await pautasDatabase.consultar(db.database)
        setPatterns(pautas)
    }

    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleInternalMessageModal}>
                <div style={{width: '100%', position: 'absolute', top: 0, left: 0, textAlign: 'right'}}>
                    <Button style={{borderRadius: '50%', width: 36, height: 36}} onClick={closeModal}>
                        <Close />
                    </Button>
                </div>
                <Grid container xl={12} lg={12} style={{width: '100%'}}>
                    <Grid item xl={12} lg={12}>
                        <h3>Pautas en dispositivo. Total descargadas: {patterns.length}</h3>
                    </Grid>
                </Grid>
                <Grid container xl={12} style={{width: '100%', paddingTop: 30}}>
                    <Grid item xl={1} lg={1}>
                        <strong>N°</strong>
                    </Grid>
                    <Grid item xl={1} lg={1}>
                        <strong>Tipo PM</strong>
                    </Grid>
                    <Grid item xl={2} lg={2}>
                        <strong>ID PM</strong>
                    </Grid>
                    <Grid item xl={2} lg={2}>
                        <strong>Acción</strong>
                    </Grid>
                </Grid>
                <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 290px)' }}>
                {
                    patterns.map((pattern, index) => {
                        return (
                            <Grid container key={index} style={{width: '100%', paddingTop: 25, paddingBottom: 25, maxHeight: 'calc(100vh - 200px)', borderBottomColor: '#ccc', borderBottomWidth: 1, borderBottomStyle: 'solid'}}>
                                <Grid item xl={1} lg={1}>
                                    {index + 1}
                                </Grid>
                                <Grid item xl={1} lg={1}>
                                    {pattern.typepm}
                                </Grid>
                                <Grid item xl={2} lg={2}>
                                    {pattern.idpm}
                                </Grid>
                                <Grid item xl={2} lg={2}>
                                    {pattern.action}
                                </Grid>
                            </Grid>
                        )
                    })
                }
                </div>
                {/* <Fab onClick={()=>closeModal()} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab> */}
            </Box>
        </Modal>
    )
}

export default PatternsDownloadedModal