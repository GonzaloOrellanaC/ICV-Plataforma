import { Button, Dialog, DialogContent, IconButton, Slide } from "@material-ui/core"
import { Close, ChangeHistoryTwoTone } from "@material-ui/icons"
import { forwardRef, useEffect, useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css" 
import "slick-carousel/slick/slick-theme.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowAltCircleLeft, faArrowAltCircleRight, faImage } from "@fortawesome/free-solid-svg-icons"
import { Navigation, Pagination, Scrollbar, A11y, EffectCreative, Keyboard, Zoom } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import "swiper/swiper-bundle.min.css"
import "swiper/swiper.min.css"
import { LoadingLogoModal } from "../modals"
import { imageToBase64 } from "../config"
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

/* SwiperCore.use([EffectCoverflow, Pagination]) */

const ImageAstDialog = ({handleClickOpen, open, handleClose, images}) => {
    console.log(images)
    
    const [sliderIndex, setSliderIndex] = useState()
    const [openLoadingLogoModal, setOpenLoadinlogoModal] = useState(false)
    const [imagesList, setImagesList] = useState(images)
    const [image, setImage] = useState()
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
    const changeImage = () => {
        console.log(images[sliderIndex])
        upImage(images[sliderIndex])
    }
    const upImage = (image) => {
        document.getElementById('astChange').click();
        setImage(image)
    }
    const uploadImageReport = async (file) => {
        if(file) {
          setOpenLoadinlogoModal(true)
          let res = await imageToBase64(file)
          setTimeout(() => {
            if(res) {
              image.image = res
              setOpenLoadinlogoModal(false)
            }
          }, 1000);
        }
    }
    const deleteImage = () => {
        setOpenLoadinlogoModal(true)
        console.log(images)
        const newList = images.splice(sliderIndex, 1)
        console.log(newList)
        setImagesList(images)
        setTimeout(() => {
            setOpenLoadinlogoModal(false)
        }, 1000);
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
                <Swiper
                    grabCursor={true}
                    effect={"creative"}
                    creativeEffect={{
                      prev: {
                        shadow: true,
                        translate: [0, 0, -400],
                      },
                      next: {
                        translate: ["100%", 0, 0],
                      },
                    }}
                    zoom={true}
                    modules={[Zoom, Navigation, Pagination, Scrollbar, A11y, EffectCreative, Keyboard]}
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation
                    keyboard={{
                      enabled: true,
                    }}
                    style={{
                        "--swiper-navigation-color": "#be2e26",
                        "--swiper-pagination-color": "#be2e26",
                    }}
                    className="mySwiper"
                    pagination={{ clickable: true }} 
                    /* scrollbar={{ draggable: false }} */
                    onSwiper={(swiper) => setSliderIndex(swiper.activeIndex)}
                    onSlideChange={(e) => setSliderIndex(e.activeIndex)}
                >
                    {
                        imagesList.map((element, index) => {
                            console.log(element)
                            return (
                                <SwiperSlide key={index} style={{height: '80vh', display: 'block', width: '100%', textAlign: 'center'}}>
                                    <div className="swiper-zoom-container">
                                        <img 
                                            key={index}
                                            src={/* (element.image.length > 0) ? element.image :  */element.imageUrl}
                                            style={{height: '85vh', textAlign: 'center'}}
                                        />
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                    <input autoComplete="off" type="file" id="astChange" accept="image/x-png,image/jpeg" onChange={(e)=>{uploadImageReport(e.target.files[0])}} hidden />
                </Swiper>
                <div style={{width: '100%', textAlign: 'center', position: 'absolute', bottom: 10}}>
                    
                    <Button
                        style={{backgroundColor: '#fff', borderStyle: 'solid', borderWidth: 1, borderColor: 'green', color: 'green', marginRight: 10}}
                        onClick={()=>{changeImage()}}
                        >
                        <FontAwesomeIcon style={{fontSize: 30, marginRight: 10}} icon={faImage} /> Cambiar AST
                    </Button>
                    <Button
                        style={{backgroundColor: '#fff', borderStyle: 'solid', borderWidth: 1, borderColor: 'red', color: 'red'}}
                        onClick={()=>{deleteImage()}}
                        >
                        <Close style={{fontSize: 30, marginRight: 10}} /> Borrar AST
                    </Button>
                </div>
            </DialogContent>
            <IconButton
                style={{position: 'absolute', zIndex: 2, top: 20, right: 20, backgroundColor: '#fff'}}
                onClick={handleClose}
                >
                <Close />
            </IconButton>
            <LoadingLogoModal open={openLoadingLogoModal} />
        </Dialog>
    )
}

export default ImageAstDialog