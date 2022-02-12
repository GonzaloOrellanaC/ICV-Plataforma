import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Button, ListItem, IconButton, Checkbox } from "@material-ui/core";
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReadActivityModal, WriteActivityModal } from '../../modals'
import { executionReportsDatabase, reportsDatabase } from "../../indexedDB";
import { executionReportsRoutes, reportsRoutes } from "../../routes";

const PautaDetail = ({height, pauta, reportAssigned, executionReport, setProgress, reportAssignment, reportLevel}) => {

    //Toda la pauta
    const [ gruposObservaciones, setGrupoObservaciones ] = useState([]);

    //Pestañas
    const [ gruposKeys, setGruposKeys ] = useState([]);

    //Contenido de la vista
    const [ contentData, setContentData ] = useState([]);

    //Lista de checks
    const [ checks, setChecks ] = useState([])

    const [ openReadActivity, setOpenReadActivity ] = useState(false);
    const [ openWriteActivity, setOpenWriteActivity ] = useState(false);

    //Indice de la actividad
    const [ indexActivity, setIndexActivity ] = useState();
    
    useEffect(() => {
        console.log(pauta)
        readData();
    }, []);

    const readData = () => {
        /* try{ */
            
            let group = pauta.struct.reduce((r, a) => {
                r[a.strpmdesc] = [...r[a.strpmdesc] || [], a];
                return r;
            }, {});
            if(group) {
                console.log(executionReport)
                let groupData;
                if(executionReport) {
                    if(!executionReport.group) {
                        executionReport.group = group;
                        setGrupoObservaciones(executionReport.group);
                        groupData = Object.keys(executionReport.group)
                    }else{
                        setGrupoObservaciones(group);
                        groupData = Object.keys(group);
                    }
                }else{
                    setGrupoObservaciones(group);
                    groupData = Object.keys(group);
                }
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
                        let checkedList = [];
                        let checkedTrue = [];
                        let content = executionReport.group[newGroupData[0].data];
                        content.forEach((e, n)=>{
                            if(!e.obs01) {
                                e.obs01 = 'Sin Observaciones'
                            }
                            if(e.isChecked) {
                                checkedTrue.push(e.isChecked)
                            }else{
                                e.isChecked = false;
                            }
                            checkedList.push(e.isChecked)
                            if(n == (content.length - 1)) {
                                setChecks(checkedList);
                                setGruposKeys(newGroupData);
                                setContentData(content);
                                let resultProgress = (checkedTrue.length * 100) / content.length
                                setProgress(resultProgress)
                            }
                        })
                    }
                })
            }
        /* } catch (err) {
            alert('Error 0010: Existe un problema en la lectura de los datos. Si el problema persiste, contacte al administrador de la plataforma.')
        } */
    }

    const handleContent = (gruposKeys, element) => {
        setContentData([])
        gruposKeys.forEach((tab, index) => {
            tab.state = false;
            if(index == (gruposKeys.length - 1)) {
                let checkedList = [];
                let checkedTrue = [];
                let newGruposObservaciones = executionReport.group[element.data]//gruposObservaciones[element.data]
                newGruposObservaciones.forEach((e, n)=>{
                    if(!e.obs01) {
                        e.obs01 = 'Sin Observaciones'
                    }
                    if(e.isChecked) {
                        checkedTrue.push(e.isChecked)
                    }else{
                        e.isChecked = false;
                    }
                    checkedList.push(e.isChecked)
                    if(n == (newGruposObservaciones.length - 1)) {
                        setChecks(checkedList);
                        element.state = true
                        let resultProgress = ( (checkedTrue.length) * 100) / newGruposObservaciones.length
                        setProgress(resultProgress);
                        setTimeout(() => {
                            setContentData(newGruposObservaciones);
                        }, 100);
                    }
                })
                
            }
        })
    }

    const closeModal = async () => {
        if(!reportAssigned.dateInit) {
            reportAssigned.dateInit = Date.now();
        }
        let contentCache = contentData;
        executionReport.updatedBy = localStorage.getItem('_id');
        executionReport.offLineGuard = Date.now();
        let db = await reportsDatabase.initDbReports();
        if( db ) {
            let res = await reportsDatabase.actualizar(reportAssigned, db.database);
            let db2 = await executionReportsDatabase.initDb();
            let res2 = await executionReportsDatabase.actualizar(executionReport, db2.database);
            if( res && res2 ) {
                if(navigator.onLine) {
                    executionReportsRoutes.saveExecutionReport(executionReport)
                    reportsRoutes.editReport(reportAssigned)
                }
                setOpenReadActivity(false)
                contentCache[indexActivity].isWarning = true
                let checkedList = [];
                let checkedTrue = [];
                contentCache.forEach((e, n) => {
                    if(e.isChecked) {
                        checkedTrue.push(e.isChecked)
                    }else{
                        e.isChecked = false;
                    }
                    checkedList.push(e.isChecked)
                    if(n == (contentCache.length - 1)) {
                        let newProgress = ( (checkedTrue.length) * 100) / contentCache.length;
                        setChecks(checkedList)
                        setProgress(newProgress);
                        setContentData(contentCache)
                    }
                })

            }
        }
    }

    const onlyClose = () => {
        setOpenReadActivity(false);
        setOpenWriteActivity(false);
    }

    const closeWriteModal = async () => {
        if(!reportAssigned.dateInit) {
            reportAssigned.dateInit = Date.now();
        }
        let contentCache = contentData;
        if(contentCache[indexActivity].writeCommits) {
            executionReport.updatedBy = localStorage.getItem('_id');
            executionReport.offLineGuard = Date.now();
            let db = await executionReportsDatabase.initDb();
            if( db ) {
                let res = await reportsDatabase.actualizar(reportAssigned, db.database);
                let db2 = await executionReportsDatabase.initDb();
                let res2 = await executionReportsDatabase.actualizar(executionReport, db2.database);
                if( res && res2 ) {
                    if(navigator.onLine) {
                        executionReportsRoutes.saveExecutionReport(executionReport)
                        reportsRoutes.editReport(reportAssigned)
                    }
                    setOpenWriteActivity(false);
                    contentCache[indexActivity].isWarning = false
                    let checkedList = [];
                    let checkedTrue = [];
                    contentCache.forEach((e, n) => {
                        if(e.isChecked) {
                            checkedTrue.push(e.isChecked)
                        }else{
                            e.isChecked = false;
                        }
                        checkedList.push(e.isChecked)
                        if(n == (contentCache.length - 1)) {
                            let newProgress = ( (checkedTrue.length) * 100) / contentCache.length;
                            setChecks(checkedList)
                            setProgress(newProgress);
                            setContentData(contentCache)
                        }
                    })
                }
            }
        }else{
            setOpenWriteActivity(false);
        }
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
        nextArrow: <SampleArrow />,
        prevArrow: <SampleArrow />
    }


    return (
        <div>
            <div style={{height: 70, borderColor: '#ccc', borderWidth: 2, borderStyle: 'solid', borderRadius: 10}}>
                <Slider {...settings}>
                    {
                        gruposKeys.map((element, index) => {
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
            <div>
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
                                    <IconButton onClick={()=>{setOpenReadActivity(true); setIndexActivity(n)}}>
                                        <FontAwesomeIcon icon={faEye}/>
                                    </IconButton>
                                    <IconButton onClick={()=>{setOpenWriteActivity(true); setIndexActivity(n)}}>
                                        <FontAwesomeIcon icon={faPen}/>
                                    </IconButton>
                                    <Checkbox checked={checks[n]} disabled style={{transform: "scale(1.2)"}} icon={<CircleUnchecked />} checkedIcon={<CircleCheckedFilled style={{color: e.isWarning ? '#EAD749' : '#27AE60'}} />} />
                                </ListItem>
                            )
                        })
                    }   
                </div>}
                {
                    openReadActivity && <ReadActivityModal reportLevel={reportLevel} open={openReadActivity} closeModal={closeModal} onlyClose={onlyClose} activity={contentData[indexActivity]} reportAssignment={reportAssignment} reportId={executionReport._id}/>
                }
                {
                    openWriteActivity && <WriteActivityModal reportLevel={reportLevel} open={openWriteActivity} closeWriteModal={closeWriteModal} onlyClose={onlyClose} activity={contentData[indexActivity]} reportAssignment={reportAssignment} reportId={executionReport._id}/>
                }
            </div>
        </div>
    )
}

export default PautaDetail