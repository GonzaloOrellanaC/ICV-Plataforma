import { useState, useEffect } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css" 
import "slick-carousel/slick/slick-theme.css"
import { Button, ListItem, IconButton, Checkbox, Grid, Hidden } from "@material-ui/core"
import CircleCheckedFilled from '@material-ui/icons/CheckCircle'
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked'
import { faEye, faPen, faPaperclip, faCommentDots } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReadActivityModal, WriteActivityModal } from '../../modals'
import { executionReportsDatabase } from "../../indexedDB"
import { apiIvcRoutes, executionReportsRoutes, reportsRoutes } from "../../routes"
import { compareExecutionReport, getExecutionReport, saveExecutionReport } from "../../config"
import { ReportDataDialog } from '../../dialogs'

const PautaDetail = ({height, pauta,  reportAssigned, setProgress, reportAssignment, reportLevel, setIndexGroupToSend, resultThisItemProgress, selectionItem}) => {

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

    const [ descriptionWidth, setDescriptionWith ] = useState('12%')
    const [ obsWidth, setObsWith ] = useState('20%')
    
    useEffect(() => {
        if(pauta.action === 'Inspección') {
            setDescriptionWith('30%')
            setObsWith('30%')
        }
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
                resolve(data.data[0])
            })
        })
    }

    const getExecutionReportFromDb = (id) => {
        return new Promise(async resolve => {
            const db = await executionReportsDatabase.initDb()
            const {database} = db
            let resList = new Array()
            resList = await executionReportsDatabase.consultar(database)
            const resFiltered = resList.filter(item => {if(item.reportId === id) {return item}})
            resolve(resFiltered[0])
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
        let executionReportDataElement
        let executionReportDataElementGuard
        if(navigator.onLine) {
            executionReportDataElement = await getExecutionReportData()
            executionReportDataElementGuard = await getExecutionReportFromDb(reportAssigned._id)
            if(executionReportDataElement.offLineGuard) {
                if(executionReportDataElementGuard) {
                    if(executionReportDataElementGuard.offLineGuard) {
                        if(executionReportDataElementGuard.offLineGuard > executionReportDataElement.offLineGuard) {
                            executionReportData = executionReportDataElementGuard
                        }else{
                            executionReportData = executionReportDataElement
                        }
                    }else{
                        executionReportData = executionReportDataElement
                    }
                }else{
                    executionReportData = executionReportDataElement
                }
            }else{
                if(executionReportDataElementGuard) {
                    if(executionReportDataElementGuard.offLineGuard) {
                        executionReportData = executionReportDataElementGuard
                    }else{
                        executionReportData = executionReportDataElement
                    }
                }else{
                    executionReportData = executionReportDataElement
                }
            }
        }else{
            executionReportDataElement = await getExecutionReportFromDb(reportAssigned._id)
            executionReportData = executionReportDataElement
        }
        if(reportAssigned.testMode) {
            if(executionReportData.group) {
                setGroup(executionReportData.group)
                setGroupData(Object.keys(executionReportData.group), executionReportData.group, true)
                setTotalProgress(executionReportData.group)
                setExecutionReport(executionReportData)
                saveExecutionReport(executionReportData, reportAssigned)
            }else{
                let data = await apiIvcRoutes.getStructsPauta2(pauta.idpm, pauta.typepm)
                pauta.struct = data.data
                groupD = pauta.struct.reduce((r, a) => {
                    r[a.strpmdesc] = [...r[a.strpmdesc] || [], a]
                    return r
                }, {})
                setGroup(groupD)
                executionReportData.group = groupD
                setGroupData(Object.keys(groupD), groupD, true)
                setTotalProgress(groupD)
                executionReportsRoutes.saveExecutionReport(executionReportData)
                setExecutionReport(executionReportData)
                saveExecutionReport(executionReportData, reportAssigned)
            }
        }else{
            if(executionReportData.group) {
                setGroup(executionReportData.group)
                setGroupData(Object.keys(executionReportData.group), executionReportData.group)
                setTotalProgress(executionReportData.group)
                setExecutionReport(executionReportData)
                saveExecutionReport(executionReportData, reportAssigned)
            }else{
                let data = await apiIvcRoutes.getStructsPauta2(pauta.idpm, pauta.typepm)
                pauta.struct = data.data
                groupD = pauta.struct.reduce((r, a) => {
                    r[a.strpmdesc] = [...r[a.strpmdesc] || [], a]
                    return r
                }, {})
                setGroup(groupD)
                executionReportData.group = groupD
                setGroupData(Object.keys(groupD), groupD)
                setTotalProgress(executionReportData.group)
                executionReportsRoutes.saveExecutionReport(executionReportData)
                setExecutionReport(executionReportData)
                saveExecutionReport(executionReportData, reportAssigned)
            }
        }
    }

    const setTotalProgress = (data) => {
        let list = []
        let isCheckedList = []
        let noIsCheckedList = []
        let isCheckedNumber = 0
        let isNoCheckedNumber = 0
        Object.values(data).map((item, i) => {
            list = list.concat(item)
            if(i == (Object.values(data).length - 1)) {
                console.log(list.length)
                list.map((el, number) => {
                    console.log(el.isChecked)
                    console.log(number)
                    if (el.isChecked === true) {
                        isCheckedList.push(true)
                        isCheckedNumber = isCheckedNumber + 1
                    } else {
                        noIsCheckedList.push(false)
                        isNoCheckedNumber = isNoCheckedNumber + 1
                    }
                    if (number == (list.length - 1)) {
                        console.log(isCheckedList, noIsCheckedList)
                        console.log((isCheckedList.length * 100) / noIsCheckedList.length)
                        console.log((isNoCheckedNumber * 100) / isNoCheckedNumber)
                        console.log(isNoCheckedNumber, isNoCheckedNumber)
                        resultThisItemProgress((/* (noIsCheckedList.length + isCheckedList.length) */isCheckedList.length * 100) / list.length)
                    }
                })
            }
        })
    }

    const handleContent = (gruposKeys, element) => {
        /* console.log(gruposKeys, element) */
        selectionItem(element.data)
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

    /* const closeModal = async (isOnlyClose) => {
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
    } */
      
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
        setTotalProgress(executionReport.group)
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
                <Grid container>
                    <Grid item xl={'auto'} md={'auto'}>
                        <p style={{margin: 0, textAlign: 'center', width: 30}}> <strong>N°</strong> </p>
                    </Grid>
                    <Grid item xl={1} md={1}>
                        <p style={{margin: 0, textAlign: 'center'}}> <strong>Personal <br /> Necesario</strong> </p>
                    </Grid>
                    <Grid item xl={'auto'} md={'auto'}>
                        <p style={{margin: 0, textAlign: 'center', width: 150}}> <strong>Descripcion De Tarea</strong> </p>
                    </Grid>
                    <Grid item xl={(pauta.action === 'Mantención') ? 3 : 5} md={(pauta.action === 'Mantención') ? 3 : 5} sm={4}>
                        <p style={{margin: 0, textAlign: 'center'}}> <strong>Observaciones</strong> </p>
                    </Grid>
                    <Hidden mdDown>
                        {(pauta.action === 'Mantención') && <Grid item xl={'auto'} md={'auto'}>
                            <p style={{margin: 0, textAlign: 'center', width: 100}}> <strong>N° Parte <br /> a Utilizar</strong> </p>
                        </Grid>}
                        {(pauta.action === 'Mantención') && <Grid item xl={'auto'} md={'auto'}>
                            <p style={{margin: 0, textAlign: 'center', width: 100}}> <strong>Cantidad <br /> a utilizar</strong> </p>
                        </Grid>}
                        {(pauta.action === 'Mantención') && <Grid item xl={'auto'} md={'auto'}>
                            <p style={{margin: 0, textAlign: 'center', width: 60}}> <strong>Cantidad <br /> Utilizada</strong> </p>
                        </Grid>}
                        {(pauta.action === 'Mantención') && <Grid item xl={1} md={1}>
                            <p style={{margin: 0, textAlign: 'center', width: 100}}> <strong>Tipo <br /> Rpto</strong> </p>
                        </Grid>}
                    </Hidden>
                    <Grid item xl={1} md={'auto'}>
                        <p style={{margin: 0, textAlign: 'center', width: 50}}> <strong>Ejecutar <br /> Tarea</strong> </p>
                    </Grid>
                    <Grid item xl={1} md={1}>
                        <p style={{margin: 0, textAlign: 'center'}}> <strong>Estado</strong> </p>
                    </Grid>
                </Grid>
                {contentData && <div style={{height: height, overflowY: 'scroll'}}>
                    {
                        contentData.map((e, n) => {
                            return(
                                <Grid key={n} container style={{borderBottomStyle: 'solid', borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
                                    <Grid item xl={'auto'} md={'auto'}>
                                        <p style={{fontSize: 12, padding: 5, margin: 0, textAlign: 'center', width: 30}}> <strong>{n+1}.-</strong> </p>
                                    </Grid>
                                    <Grid item xl={1} md={1}>
                                        <p style={{fontSize: 12, padding: 5, margin: 0, textAlign: 'center'}}> {e.workteamdesc}   </p>
                                    </Grid>
                                    <Grid item xl={'auto'} md={'auto'}>
                                        <p style={{fontSize: 12, padding: 5, margin: 0, textAlign: 'left', width: 150}}> {e.taskdesc} </p>
                                    </Grid>
                                    <Grid item xl={(pauta.action === 'Mantención') ? 3 : 5} md={(pauta.action === 'Mantención') ? 3 : 5} sm={4}>
                                        <p style={{fontSize: 12, padding: 5, margin: 0, textAlign: 'justify'}}> {e.obs01} </p>
                                    </Grid>
                                    <Hidden mdDown>
                                        {(pauta.action === 'Mantención') && <Grid item xl={'auto'} md={'auto'}>
                                            {(e.partnumberUtl === '*') ? <p style={{fontSize: 12, padding: 5, margin: 0, textAlign: 'center', width: 100}}>N/A</p> : <p style={{padding: 5, margin: 0, textAlign: 'center', width: 100}}>{e.partnumberUtl}</p>}
                                        </Grid>}
                                        {(pauta.action === 'Mantención') && <Grid item xl={'auto'} md={'auto'}>
                                            {(e.unidad === '*') ? <p style={{fontSize: 12, padding: 5, margin: 0, textAlign: 'center', width: 100}}>N/A</p> : <p style={{padding: 5, margin: 0, textAlign: 'center', width: 100}}> {e.cantidad} {e.unidad}</p>}
                                        </Grid>}
                                        {(pauta.action === 'Mantención') && <Grid item xl={'auto'} md={'auto'}>
                                            {(e.unidad === '*') ? <p style={{fontSize: 12, padding: 5, margin: 0, textAlign: 'center', width: 60}}>N/A</p> : <p style={{padding: 5, margin: 0, textAlign: 'center', width: 60}}> {e.unidadData ? e.unidadData : '___'} {e.unidad}</p>}
                                        </Grid>}
                                        {(pauta.action === 'Mantención') && <Grid item xl={1} md={1}>
                                            {(e.idtypeutlPartnumber === '*') ? <p style={{fontSize: 12, padding: 5, margin: 0, textAlign: 'center', width: 100}}>N/A</p> : <p style={{padding: 5, margin: 0, textAlign: 'center', width: 100}}> {e.idtypeutlPartnumber}</p>}
                                        </Grid>}
                                    </Hidden>
                                    <Grid item xl={1} md={'auto'}>
                                        <div style={{textAlign: 'center', width: 60}}>
                                            <IconButton style={{width: '5%', textAlign: 'center'}} onClick={()=>{openDialog(e, n); setIndexActivity(n)}}>
                                                <FontAwesomeIcon icon={iconToItemDetail}/>
                                            </IconButton>
                                        </div>
                                    </Grid>
                                    <Grid item xl={1} md={1}>
                                        <Checkbox checked={checks[n]} disabled style={{transform: "scale(1.2)"}} icon={<CircleUnchecked />} checkedIcon={<CircleCheckedFilled style={{color: e.isWarning ? '#EAD749' : '#27AE60'}} />} />
                                        {e.messages && <IconButton style={{padding: 5}} disabled><FontAwesomeIcon icon={faCommentDots} /></IconButton>}
                                        {!e.messages && <IconButton style={{padding: 5}} disabled><FontAwesomeIcon style={{color: 'transparent'}} icon={faCommentDots} /></IconButton>}
                                        {e.haveClip && <IconButton style={{padding: 5}} disabled><FontAwesomeIcon icon={faPaperclip} /></IconButton>}
                                        {!e.haveClip && <IconButton style={{padding: 5}} disabled><FontAwesomeIcon style={{color: 'transparent'}} icon={faPaperclip} /></IconButton>}
                                    </Grid>
                                </Grid>
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