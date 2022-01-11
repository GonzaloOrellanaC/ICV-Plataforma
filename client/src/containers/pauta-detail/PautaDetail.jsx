import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Button, ListItem, IconButton, Checkbox } from "@material-ui/core";
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReadActivityModal } from '../../modals'

const PautaDetail = ({height, pauta, setReportLocation}) => {
    const [ gruposObservaciones, setGrupoObservaciones ] = useState([]);
    const [ gruposKeys, setGruposKeys ] = useState([]);
    const [ contentData, setContentData ] = useState([]);
    const [ openReadActivity, setOpenReadActivity ] = useState(false);
    const [ activity, setActivity ] = useState({})
    
    useEffect(() => {
        let group = pauta.struct.reduce((r, a) => {
            r[a.strpmdesc] = [...r[a.strpmdesc] || [], a];
            return r;
        }, {});
        if(group) {
            setGrupoObservaciones(group);
            let groupData = Object.keys(group);
            let newGroupData = [];
            groupData.forEach((data, index) => {
                let tab = {
                    data: data,
                    state: false
                }
                if(index == 0) {
                    tab.state = true;
                }
                newGroupData.push(tab);
                if(index == (groupData.length - 1)) {
                    setGruposKeys(newGroupData);
                    setContentData(group[newGroupData[0].data]);
                    setReportLocation(newGroupData[0].data)
                }
            })
        }
    }, []);

    const handleContent = (gruposKeys, element) => {
        setReportLocation(element.data)
        gruposKeys.forEach((tab, index) => {
            tab.state = false;
            if(index == (gruposKeys.length - 1)) {
                
                setContentData(gruposObservaciones[element.data]);
                element.state = true
            }
        })
        
    }

    const closeModal = () => {
        setOpenReadActivity(false)
    }

    const well = {
        height: 70,
        borderRadius: 10,
        boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.08)'
    }
      
    const SampleArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{color: 'black', background: "grey", borderRadius: 20}}
                onClick={onClick}
            />
        );
    }

    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 7,
        //className: 'menuPautaDetail',
        nextArrow: <SampleArrow />,
        prevArrow: <SampleArrow />
    }


    return (
        <div style={{height: height}}>
            <div style={{height: 70, borderColor: '#ccc', borderWidth: 2, borderStyle: 'solid', borderRadius: 10}}>
                <Slider {...settings}>
                    {
                        gruposKeys && gruposKeys.map((element, index) => {
                            
                            return (
                                <div 
                                    key={index} 
                                    style={{
                                    textAlign: 'center', 
                                    height: '100%'}}>

                                        <Button style={{textAlign: 'center', width: '100%', height: 70}} onClick={() => handleContent(gruposKeys, element)}>
                                            <p style={{margin: 0}}>{element.data}</p>
                                        </Button>
                                    {
                                        element.state && <div style={{width: '100%', height: 6, backgroundColor: '#BB2D2D', position: 'relative', bottom: 5, borderRadius: 5}}>

                                        </div>
                                    }
                                </div>
                            )
                        })
                    }
                </Slider>
            </div>
            <div style={{height: height}}>
                <ListItem>
                    <div style={{width: '15%', marginLeft: 5}}>
                        <p style={{margin: 0}}> <strong>Personal Necesario</strong> </p>
                    </div>
                    <div style={{width: '30%', marginLeft: 5}}>
                        <p style={{margin: 0}}> <strong>Descripcion De Tarea</strong> </p>
                    </div>
                    <div style={{width: '40%', marginLeft: 5}}>
                        <p style={{margin: 0}}> <strong>Observaciones</strong> </p>
                    </div>
                    <div style={{width: '15%', marginLeft: 5}}>
                        <p style={{margin: 0}}> <strong>Acciones</strong> </p>
                    </div>
                </ListItem>
                {contentData && <div style={{height: height, overflowY: 'scroll'}}>
                    {
                        contentData.map((e, n) => {
                            
                            if(!e.obs01) {
                                e.obs01 = 'Sin Observaciones'
                            }
                            return(
                                <ListItem key={n} style={well}>
                                    <div style={{width: '15%', marginLeft: 5 }}>
                                        {e.workteamdesc}    
                                    </div>
                                    <div style={{width: '30%', marginLeft: 5 , overflowY: 'scroll', textOverflow: 'ellipsis', maxHeight: '100%'}}>
                                        {e.taskdesc}  
                                    </div>
                                    <div style={{width: '40%', marginLeft: 5 , overflowY: 'scroll', textOverflow: 'ellipsis', maxHeight: '100%'}}>
                                        {e.obs01}  
                                    </div>
                                    <IconButton onClick={()=>{setOpenReadActivity(true); setActivity(e)}}>
                                        <FontAwesomeIcon icon={faEye}/>
                                    </IconButton>
                                    <IconButton>
                                        <FontAwesomeIcon icon={faPen}/>
                                    </IconButton>
                                    <Checkbox checked={e.isChecked} disabled style={{transform: "scale(1.2)"}} icon={<CircleUnchecked />} checkedIcon={<CircleCheckedFilled style={{color: '#27AE60'}} />} />
                                </ListItem>
                            )
                        })
                    }   
                </div>}
                <ReadActivityModal open={openReadActivity} closeModal={closeModal} activity={activity}/>
            </div>
        </div>
    )
}

export default PautaDetail