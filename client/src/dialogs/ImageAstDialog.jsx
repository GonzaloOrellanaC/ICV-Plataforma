import { Button, Dialog, DialogContent, IconButton, Slide } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import { forwardRef } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css" 
import "slick-carousel/slick/slick-theme.css"
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ImageAstDialog = ({handleClickOpen, open, handleClose, images}) => {
    const SampleArrow = (props) => {
        const { className, style, onClick } = props
        return (
            <div
                className={className}
                style={{color: 'black', background: "grey", borderRadius: 20}}
                onClick={onClick}
            />
        )
    }
    const settings = {
        infinite: false,
        speed: 500,
        adaptiveHeight: true,
        focusOnSelect: true,
    }
    
    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            adaptiveHeight={true}
        >
            <DialogContent className="dialog-content-ast">
                <Slider {...settings} className='slider-images'>
                    {
                        images.map((element, index) => {
                            return (
                                <div style={{height: '100vh', display: 'block', width: '100%', textAlign: 'center'}}>
                                    <img 
                                        key={index}
                                        src={element.image}
                                        style={{maxHeight: '90vh', textAlign: 'center'}}
                                    />
                                </div>
                            )
                        })
                    }
                </Slider>
                <div style={{width: '100%', textAlign: 'center', position: 'absolute', bottom: 10}}>
                    <p style={{fontSize: 20}}><strong>Solo puede deslizar imágenes.</strong></p>
                </div>
            </DialogContent>
            <IconButton
                style={{position: 'absolute', top: 20, right: 20, backgroundColor: '#fff'}}
                onClick={handleClose}
                >
                <Close />
            </IconButton>
        </Dialog>
    )
}

export default ImageAstDialog