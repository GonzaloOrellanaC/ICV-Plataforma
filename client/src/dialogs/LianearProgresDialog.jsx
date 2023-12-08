import {LinearProgress, Dialog, Box} from '@mui/material';

const LianearProgresDialog = ({open, progress, buffer}) => {
    return(
        <Dialog
            open={open}
        >
            <Box sx={{width: 300, height: 20}}>
                <LinearProgress  variant={'determinate'} value={progress} color={'error'} style={{ height: 20}} valueBuffer={buffer}/>
            </Box>
        </Dialog>
    )
}

export default LianearProgresDialog