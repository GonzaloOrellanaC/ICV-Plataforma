import { Button, Dialog, DialogContent, IconButton, Slide } from "@material-ui/core"
import { Close, ChangeHistoryTwoTone } from "@material-ui/icons"
import { forwardRef } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css" 
import "slick-carousel/slick/slick-theme.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowAltCircleLeft, faArrowAltCircleRight, faImage } from "@fortawesome/free-solid-svg-icons"
/* import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js'
import 'swiper/swiper.min.scss' */
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
                {/* <Swiper
                    spaceBetween={50}
                    slidesPerView={3}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                    >
                        {
                            images.map((element, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <div style={{height: '100vh', display: 'block', width: '100%', textAlign: 'center'}}>
                                            <img 
                                                key={index}
                                                src={element.image}
                                                style={{maxHeight: '85vh', textAlign: 'center'}}
                                            />
                                        </div>
                                    </SwiperSlide>
                                )
                            })
                        }
                </Swiper> */}
                <Slider {...settings} className='slider-images' onSwipe={(e) => {console.log(e)}}>
                    {
                        images.map((element, index) => {
                            return (
                                <div key={index} style={{height: '100vh', display: 'block', width: '100%', textAlign: 'center'}}>
                                    <img 
                                        src={element.image}
                                        style={{maxHeight: '85vh', textAlign: 'center'}}
                                    />
                                </div>
                            )
                        })
                    }
                </Slider>
                <div style={{width: '100%', textAlign: 'center', position: 'absolute', bottom: 10}}>
                    <p style={{fontSize: 20}}><strong>Solo puede deslizar imágenes.</strong></p>
                    <Button
                        style={{backgroundColor: '#fff', borderStyle: 'solid', borderWidth: 1, borderColor: 'green', color: 'green', marginRight: 10}}
                        onClick={handleClose}
                        >
                        <FontAwesomeIcon style={{fontSize: 30, marginRight: 10}} icon={faImage} /> Cambiar AST
                    </Button>
                    <Button
                        style={{backgroundColor: '#fff', borderStyle: 'solid', borderWidth: 1, borderColor: 'red', color: 'red'}}
                        onClick={handleClose}
                        >
                        <Close style={{fontSize: 30, marginRight: 10}} /> Borrar AST
                    </Button>
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