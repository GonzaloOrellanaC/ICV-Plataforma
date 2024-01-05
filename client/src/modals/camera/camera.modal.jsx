import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { IconButton, Modal } from "@mui/material"
import Webcam from "react-webcam"
import { useState } from "react";

const CameraModal = ({open, handleClose, astList}) => {
    const [height, setHeight] = useState(screen.height)
    const [width, setWidth] = useState(screen.width)
    window.addEventListener("resize", (e) => {
        setHeight(e.target.screen.availHeight)
        setWidth(e.target.screen.availWidth)
    })
    const videoConstraints = {
        width: width,
        height: height,
        facingMode: "user"
    }
    return (
        <Modal
            open={open}
            style={{backgroundColor: '#ccc'}}
            id={'cameraModal'}
        >
            <div style={{textAlign: 'center'}}>

                <Webcam
                    audio={false}
                    height={height}
                    screenshotFormat="image/jpeg"
                    width={width}
                    videoConstraints={videoConstraints}
                >
                {({ getScreenshot }) => (
                    <div style={{ position: 'absolute', width: '100%', textAlign: 'center', bottom: 100 }}>
                        <IconButton
                            onClick={() => {
                                const imageSrc = getScreenshot();
                                astList.push({
                                    id: Date.now(),
                                    image: imageSrc
                                })
                                handleClose()
                            }}
                        >
                            <FontAwesomeIcon icon={faCamera} />
                        </IconButton>
                    </div>
                )}
                </Webcam>
            </div>
        </Modal>
    )
}

export default CameraModal
