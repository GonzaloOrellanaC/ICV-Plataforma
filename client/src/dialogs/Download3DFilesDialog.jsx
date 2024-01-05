import { Button, Dialog, DialogContent, IconButton, LinearProgress, Slide } from "@mui/material"
import { Close } from "@mui/icons-material"
import { forwardRef, useState } from "react"

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})
const Download3DFilesDialog = ({open, handleClose}) => {
    const [progress, setProgress] = useState(0)
    const [loadingData, setLoadingData] = useState('')

    return(
        <div>
            <Dialog
                hideBackdrop
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                BackdropProps={{invisible: true, open: false}}
                disableBackdropClick
                /* style={{position: 'absolute', right: 20, bottom: 20}} */
            >
                <DialogContent>
                    <div style={{width: 320, height: 150, padding: 50}}>
                        <LinearProgress variant="determinate" value={progress} />
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <p>{loadingData}</p>
                        </div>
                    </div>
                </DialogContent>
                <IconButton
                    style={{position: 'absolute', top: 20, right: 20, backgroundColor: '#fff'}}
                    onClick={handleClose}
                    >
                    <Close />
                </IconButton>
            </Dialog>
        </div>
    )
}

export default Download3DFilesDialog
