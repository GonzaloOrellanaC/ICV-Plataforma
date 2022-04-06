import { useState, useEffect } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css" 
import "slick-carousel/slick/slick-theme.css"
import { Button, ListItem, IconButton, Checkbox } from "@material-ui/core"
import CircleCheckedFilled from '@material-ui/icons/CheckCircle'
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked'
import { faEye, faPen, faPaperclip, faCommentDots } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReadActivityModal, WriteActivityModal } from '../../modals'
import { executionReportsDatabase } from "../../indexedDB"
import { executionReportsRoutes, reportsRoutes } from "../../routes"
import { compareExecutionReport, getExecutionReport, saveExecutionReport } from "../../config"
import { ReportDataDialog } from '../../dialogs'

const PautaDetail = ({height, pauta,  reportAssigned, setProgress, reportAssignment, reportLevel, setIndexGroupToSend}) => {

    //Pestañas
    const [ gruposKeys, setGruposKeys ] = useState([])

    //Contenido de la vista
    const [ contentData, setContentData ] = useState([])

    //
    const [ group, setGroup ] = useState()

    const [ executionReport, setExecutionReport ] = useState()

    //Lista de checks
    const [ checks, setChecks ] = useState([])

    //const [ openReadActivity, setOpenReadActivity ] = useState(false)
    //const [ openWriteActivity, setOpenWriteActivity ] = useState(false)

    //Indice de la actividad
    const [ indexActivity, setIndexActivity ] = useState()

    //
    const [ indexGroup, setIndexGroup ] = useState()

    //
    const [ openDialog1, setOpenDialog1 ] = useState(false)

    //
    const [ item, setItem ] = useState()
    const [ index, setIndex ] = useState()
    const [ iconToItemDetail, setIconToItemDetail ] = useState(faPen)
    
    useEffect(() => {
        readData()
        if((localStorage.getItem('role')==='inspectionWorker')||(localStorage.getItem('role')==='maintenceOperator')) {
            setIconToItemDetail(faPen)
        }else{
            setIconToItemDetail(faPen)
        }
    }, [])

    const getExecutionReportData = () => {
        return new Promise(resolve => {
            executionReportsRoutes.getExecutionReportById(reportAssigned)
            .then(data => {
                //console.log(data)
                resolve(data.data[0])
            })
        })
    }

    const openDialog = (item, index) => {
        setIndex(index)
        setItem(item)
        setOpenDialog1(true)
    }

    const closeDialog = () => {
        setOpenDialog1(false)
        setItem(null)
    }

    const setGroupData = (groupData, groupD, test) => {
        let newGroupData = []
        if(test) {
            groupData.forEach((data, index) => {
                let tab = {
                    data: data,
                    state: false
                }
                if(index == 0) {
                    tab.state = true
                    setIndexGroup(data)
                }
                newGroupData.push(tab)
                if(index == 3) {
                    let checkedList = []
                    let checkedTrue = []
                    let content = groupD[newGroupData[0].data]
                    content.forEach((e, n)=>{
                        if(!e.obs01) {
                            e.obs01 = 'Sin Observaciones'
                        }
                        if(e.isChecked) {
                            checkedTrue.push(e.isChecked)
                        }else{
                            e.isChecked = false
                        }
                        checkedList.push(e.isChecked)
                        if(n == (content.length - 1)) {
                            setChecks(checkedList)
                            setGruposKeys([newGroupData[0], newGroupData[1]])
                            setIndexGroupToSend([newGroupData[0], newGroupData[1]])
                            setContentData(content)
                            let resultProgress = (checkedTrue.length * 100) / content.length
                            setProgress(resultProgress)
                        }
                    })
                }
            })
        }else{
            groupData.forEach((data, index) => {
                let tab = {
                    data: data,
                    state: false
                }
                if(index == 0) {
                    tab.state = true
                    setIndexGroup(data)
                }
                newGroupData.push(tab)
                if(index == (groupData.length - 1)) {
                    let checkedList = []
                    let checkedTrue = []
                    let content = groupD[newGroupData[0].data]
                    content.forEach((e, n)=>{
                        if(!e.obs01) {
                            e.obs01 = 'Sin Observaciones'
                        }
                        if(e.isChecked) {
                            checkedTrue.push(e.isChecked)
                        }else{
                            e.isChecked = false
                        }
                        checkedList.push(e.isChecked)
                        if(n == (content.length - 1)) {
                            setChecks(checkedList)
                            setGruposKeys(newGroupData)
                            setContentData(content)
                            let resultProgress = (checkedTrue.length * 100) / content.length
                            setProgress(resultProgress)
                        }
                    })
                }
            })
        }
    }

    const readData = async () => {
        let groupD
        let executionReportData
        if(navigator.onLine) {
            let executionReportDataFromCloud = await getExecutionReportData()
            executionReportData = executionReportDataFromCloud
            if(reportAssigned.testMode) {
                if(executionReportData.group) {
                    console.log('Existe grupo')
                    setGroup(executionReportData.group)
                    setGroupData(Object.keys(executionReportData.group), executionReportData.group, true)
                    setExecutionReport(executionReportData)
                    saveExecutionReport(executionReportData, reportAssigned)
                }else{
                    console.log('Grupo no existe')
                    groupD = pauta.struct.reduce((r, a) => {
                        r[a.strpmdesc] = [...r[a.strpmdesc] || [], a]
                        return r
                    }, {})
                    setGroup(groupD)
                    executionReportData.group = groupD
                    setGroupData(Object.keys(groupD), groupD, true)
                    executionReportsRoutes.saveExecutionReport(executionReportData)
                    setExecutionReport(executionReportData)
                    saveExecutionReport(executionReportData, reportAssigned)
                }
            }else{
                if(executionReportData.group) {
                    setGroup(executionReportData.group)
                    setGroupData(Object.keys(executionReportData.group), executionReportData.group)
                    setExecutionReport(executionReportData)
                    saveExecutionReport(executionReportData, reportAssigned)
                }else{
                    groupD = pauta.struct.reduce((r, a) => {
                        r[a.strpmdesc] = [...r[a.strpmdesc] || [], a]
                        return r
                    }, {})
                    setGroup(groupD)
                    executionReportData.group = groupD
                    setGroupData(Object.keys(groupD), groupD)
                    executionReportsRoutes.saveExecutionReport(executionReportData)
                    setExecutionReport(executionReportData)
                    saveExecutionReport(executionReportData, reportAssigned)
                }
            }
        }else{
            let executionReportList = new Array()
            executionReportList = await getExecutionReport(reportAssigned._id) //executionReportsDatabase.consultar(exDb.database)
            let executionR = executionReportList.filter(r => {if(r._id === executionReportData._id) {return r}})
            if(executionR.length > 0) {
                executionReportData = executionR[0]
                groupD = executionReportData.group
            }else{
                groupD = pauta.struct.reduce((r, a) => {
                    r[a.strpmdesc] = [...r[a.strpmdesc] || [], a]
                    return r
                }, {})
            }
            setGroup(groupD)
            setGroupData(Object.keys(groupD), groupD)
            setExecutionReport(executionReportData)
        }
    }

    const handleContent = (gruposKeys, element) => {
        setContentData([])
        gruposKeys.forEach((tab, index) => {
            tab.state = false
            if(index == (gruposKeys.length - 1)) {
                let checkedList = []
                let checkedTrue = []
                let newGruposObservaciones = group[element.data]//gruposObservaciones[element.data]
                newGruposObservaciones.forEach((e, n)=>{
                    if(!e.obs01) {
                        e.obs01 = 'Sin Observaciones'
                    }
                    if(e.isChecked) {
                        checkedTrue.push(e.isChecked)
                    }else{
                        e.isChecked = false
                    }
                    checkedList.push(e.isChecked)
                    if(n == (newGruposObservaciones.length - 1)) {
                        setChecks(checkedList)
                        element.state = true
                        let resultProgress = ( (checkedTrue.length) * 100) / newGruposObservaciones.length
                        setProgress(resultProgress)
                        setTimeout(() => {
                            setContentData(newGruposObservaciones)
                            setIndexGroup(element.data)
                        }, 100)
                    }
                })
                
            }
        })
    }

    const closeModal = async (isOnlyClose) => {
        let group_ = executionReport.group
        if(!reportAssigned.dateInit) {
            reportAssigned.dateInit = Date.now()
        }
        setContentData([])
        if(group_[indexGroup][indexActivity].readCommits) {
            if(navigator.onLine) {
                if(!isOnlyClose) {
                    group_[indexGroup][indexActivity].isWarning = true
                }
                let checkedList = []
                let checkedTrue = []
                group_[indexGroup].forEach((e, n) => {
                    console.log(e)
                    if(e.isChecked) {
                        checkedTrue.push(e.isChecked)
                    }else{
                        e.isChecked = false
                    }
                    checkedList.push(e.isChecked)
                    if(n == (group_[indexGroup].length - 1)) {
                        let newProgress = ( (checkedTrue.length) * 100) / group_[indexGroup].length
                        setProgress(newProgress)
                        console.log(newProgress, group_[indexGroup])
                        setContentData(group_[indexGroup])
                        setChecks(checkedList)
                        if(navigator.onLine) {
                            executionReportsRoutes.saveExecutionReport(executionReport)
                            reportsRoutes.editReport(reportAssigned)
                        }
                        reportAssigned.idDatabase = reportAssigned.idIndex
                        saveExecutionReport(executionReport, reportAssigned)
                    }
                })
            }
        }
    }

    const onlyClose = () => {
        setOpenReadActivity(false)
        setOpenWriteActivity(false)
    }

    const closeWriteModal = async (isOnlyClose) => {
        let group_ = executionReport.group
        if(!reportAssigned.dateInit) {
            reportAssigned.dateInit = Date.now()
        }
        setContentData([])
        if(group_[indexGroup][indexActivity].writeCommits) {
            if(!isOnlyClose) {
                group_[indexGroup][indexActivity].isWarning = false
            }
            let checkedList = []
            let checkedTrue = []
            group_[indexGroup].forEach((e, n) => {
                if(e.isChecked) {
                    checkedTrue.push(e.isChecked)
                }else{
                    e.isChecked = false
                }
                checkedList.push(e.isChecked)
                if(n == (group_[indexGroup].length - 1)) {
                    let newProgress = ( (checkedTrue.length) * 100) / group_[indexGroup].length
                    setProgress(newProgress)
                    setContentData(group_[indexGroup])
                    setChecks(checkedList)
                    if(navigator.onLine) {
                        executionReportsRoutes.saveExecutionReport(executionReport)
                        reportsRoutes.editReport(reportAssigned)
                    }
                    reportAssigned.idDatabase = reportAssigned.idIndex
                    saveExecutionReport(executionReport, reportAssigned)
                }
            })
            
        }
    }

    const well = {
        borderRadius: 10,
        boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.08)'
    }
      
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
        slidesToShow: 7,
        slidesToScroll: 7,
        nextArrow: <SampleArrow />,
        prevArrow: <SampleArrow />
    }

    const save = async (index, state, item) => {
        if(!reportAssigned.dateInit) {
            reportAssigned.dateInit = Date.now()
        }
        checks[index] = true
        let checkedList = checks
        let checkedTrue = []
        let checkedFalse = []
        checkedList.map((check, i) => {
            if(check) {
                checkedTrue.push(check)
            }else{
                checkedFalse.push(check)
            }
            if(i == (checkedList.length - 1)) {
                let newProgress = ( (checkedTrue.length) * 100) / checkedList.length
                setProgress(newProgress)
            }
        })
        if(!state) {
            item.isWarning = true
        }else {
            item.isWarning = false
        }
        item.isChecked = true
        if(navigator.onLine) {
            executionReportsRoutes.saveExecutionReport(executionReport)
            reportsRoutes.editReport(reportAssigned)
            saveOnNavigator(executionReport)
        }else{
            saveOnNavigator(executionReport)
        }
    }

    const saveOnNavigator = async (executionReport) => {
        let db = await executionReportsDatabase.initDb()
        await executionReportsDatabase.actualizar(executionReport, db.database)
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
                    <div style={{width: '10%', marginLeft: 5}}>
                        <p style={{margin: 0}}> <strong>Personal Necesario</strong> </p>
                    </div>
                    <div style={{width: '20%', marginLeft: 5}}>
                        <p style={{margin: 0}}> <strong>Descripcion De Tarea</strong> </p>
                    </div>
                    <div style={{width: '25%', marginLeft: 5}}>
                        <p style={{margin: 0}}> <strong>Observaciones</strong> </p>
                    </div>
                    <div style={{width: '11%', marginLeft: 5}}>
                        <p style={{margin: 0}}> <strong>Part Number</strong> </p>
                    </div>
                    <div style={{width: '7%', textAlign: 'center'}}>
                        <p style={{margin: 0}}> <strong>Cantidad a utilizar</strong> </p>
                    </div>
                    <div style={{width: '7%', textAlign: 'center'}}>
                        <p style={{margin: 0}}> <strong>Cantidad Utilizada</strong> </p>
                    </div>
                    <div style={{width: '5%', textAlign: 'center'}}>
                        <p style={{margin: 0}}> <strong>Ejecutar Tarea</strong> </p>
                    </div>
                    <div style={{width: '15%', paddingLeft: 10, textAlign: 'left'}}>
                        <p style={{margin: 0}}> <strong>Estado</strong> </p>
                    </div>
                </ListItem>
                {contentData && <div style={{height: height, overflowY: 'scroll'}}>
                    {
                        contentData.map((e, n) => {
                            return(
                                <ListItem key={n} style={well}>
                                    <div style={{width: '10%', marginLeft: 5 }}>
                                        {e.workteamdesc}    
                                    </div>
                                    <div style={{width: '20%', marginLeft: 5 , overflowY: 'scroll', textOverflow: 'ellipsis', maxHeight: '100%'}}>
                                        {e.taskdesc}  
                                    </div>
                                    <div style={{width: '25%', marginLeft: 5 , overflowY: 'scroll', textOverflow: 'ellipsis', maxHeight: '100%'}}>
                                        {e.obs01}  
                                    </div>
                                    <div style={{width: '11%', textAlign: 'center', overflowY: 'scroll', textOverflow: 'ellipsis', maxHeight: '100%'}}>
                                        {(e.partnumberUtl === '*') ? <p>N/A</p> : <p>{e.partnumberUtl}</p>}  
                                    </div>
                                    <div style={{width: '7%', textAlign: 'center', overflowY: 'scroll', textOverflow: 'ellipsis', maxHeight: '100%'}}>
                                        {(e.unidad === '*') ? <p>N/A</p> : <p> {e.cantidad} {e.unidad}</p>}
                                    </div>
                                    <div style={{width: '7%', textAlign: 'center', overflowY: 'scroll', textOverflow: 'ellipsis', maxHeight: '100%'}}>
                                        {(e.unidad === '*') ? <p>N/A</p> : <p> {e.unidadData ? e.unidadData : '______'} {e.unidad}</p>}
                                    </div>
                                    <div style={{width: '5%', textAlign: 'center'}}>
                                        <IconButton style={{width: '5%', textAlign: 'center'}} onClick={()=>{/* setOpenWriteActivity(true) */openDialog(e, n); setIndexActivity(n)}}>
                                            <FontAwesomeIcon icon={iconToItemDetail}/>
                                        </IconButton>
                                    </div>
                                    <div style={{width: '15%', textAlign: 'center'}}>
                                        <Checkbox checked={checks[n]} disabled style={{transform: "scale(1.2)"}} icon={<CircleUnchecked />} checkedIcon={<CircleCheckedFilled style={{color: e.isWarning ? '#EAD749' : '#27AE60'}} />} />
                                        {e.messages && <IconButton disabled><FontAwesomeIcon icon={faCommentDots} /></IconButton>}
                                        {!e.messages && <IconButton disabled><FontAwesomeIcon style={{color: 'transparent'}} icon={faCommentDots} /></IconButton>}
                                        {e.haveClip && <IconButton disabled><FontAwesomeIcon icon={faPaperclip} /></IconButton>}
                                        {!e.haveClip && <IconButton disabled><FontAwesomeIcon style={{color: 'transparent'}} icon={faPaperclip} /></IconButton>}
                                    </div>
                                </ListItem>
                            )
                        })
                    }   
                </div>}
                {openDialog1 && <ReportDataDialog 
                    open={openDialog1} 
                    handleClose={closeDialog} 
                    report={reportAssigned} 
                    item={item} 
                    index={index} 
                    executionReport={executionReport} 
                    gruposKeys={gruposKeys} 
                    indexActivity={indexActivity} 
                    indexGroup={indexGroup} 
                    save={save}
                    setChecks={setChecks}
                />}
                {/* {
                    openReadActivity && <ReadActivityModal reportLevel={reportLevel} open={openReadActivity} closeModal={closeModal} onlyClose={onlyClose} activity={contentData[indexActivity]} reportAssignment={reportAssignment} reportId={executionReport._id}/>
                }
                {
                    openWriteActivity && <WriteActivityModal reportLevel={reportLevel} open={openWriteActivity} closeWriteModal={closeWriteModal} onlyClose={onlyClose} activity={executionReport.group[indexGroup][indexActivity]} reportAssignment={reportAssignment} reportId={executionReport._id}/>
                } */}
            </div>
        </div>
    )
}

export default PautaDetail