import {LinearProgress, Dialog, Box} from '@mui/material';

const LianearProgresDialog = ({open, progress}) => {
    return(
        <Dialog
            open={open}
        >
            <Box sx={{width: 300, height: 20}}>
                <LinearProgress  variant={'determinate'} value={progress} color={'error'} style={{ height: 20}} />
            </Box>
        </Dialog>
    )
}

export default LianearProgresDialog