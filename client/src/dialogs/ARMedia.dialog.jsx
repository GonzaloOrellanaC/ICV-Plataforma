import {Dialog} from '@mui/material'
import '@google/model-viewer'
import { ModelViewer, activateAR } from '@r2u/react-ar-components'
/* import type { ModelViewerElement } from '@r2u/react-ar-components' */

const ARMediaDialog = ({open}) => {
    return (
        <Dialog
            open={open}
            fullScreen
        >

        </Dialog>
    )
}

export default ARMediaDialog