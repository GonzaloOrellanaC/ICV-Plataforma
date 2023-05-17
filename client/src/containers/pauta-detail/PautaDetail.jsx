import { useState, useEffect } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css" 
import "slick-carousel/slick/slick-theme.css"
import { Button, IconButton, Checkbox, Grid, Hidden } from "@material-ui/core"
import CircleCheckedFilled from '@material-ui/icons/CheckCircle'
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked'
import { faPen, faPaperclip, faCommentDots, faEye } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoadingLogoModal } from '../../modals'
import { executionReportsDatabase } from "../../indexedDB"
import { ReportDataDialog } from '../../dialogs'
import { useAuth, useConnectionContext, useExecutionReportContext } from "../../context"
import { executionReportsRoutes } from "../../routes"

const PautaDetail = (
    {
        height,
        reportAssigned,
        setProgress,
        resultThisItemProgress,
        canEdit,
        executionReport,
        report
    }) => {
        const {isOnline} = useConnectionContext()
        const {userData, isOperator} = useAuth()
    /* const {executionReport, setExecutionReport, report} = useExecutionReportContext() */

    const [opened, setOpened] = useState(true)

    //Pestañas
    const [ gruposKeys, setGruposKeys ] = useState([])

    //Contenido de la vista
    const [ contentData, setContentData ] = useState([])


    /* const [ executionReport, setExecutionReport ] = useState() */

    //Lista de checks
    const [ checks, setChecks ] = useState([])

    //Indice de la actividad
    const [ indexActivity, setIndexActivity ] = useState()

    //
    const [ indexGroup, setIndexGroup ] = useState()

    //
    const [ openDialog1, setOpenDialog1 ] = useState(false)

    //
    const [ item, setItem ] = useState()
    const [ index, setIndex ] = useState()
    /* const [ iconToItemDetail, setIconToItemDetail ] = useState(faPen) */
    const [ loadingLogo, setLoadingLogo ] = useState(false)

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

    useEffect(() => {
        const newGroupData = []
        console.log(executionReport)
        if (executionReport._id) {
            Object.keys(executionReport.group).forEach((data, index) => {
                let tab = {
                    data: data,
                    state: false
                }
                if(index == 0) {
                    tab.state = true
                    setIndexGroup(data)
                }
                newGroupData.push(tab)
            })
            setGruposKeys(report.testMode ? [newGroupData[0], newGroupData[1], newGroupData[2]] : newGroupData)
            console.log(Object.values(executionReport.group)[0])
            setContentData(Object.values(executionReport.group)[0])
        }
    },[executionReport])

    useEffect(() => {
        console.log(contentData)
        if (isOnline && contentData && (executionReport._id)) {
            console.log(contentData)
            const checked = []
            contentData.forEach((item) => {
                if (item.isChecked) {
                    checked.push(item)
                }
            })
            const contentDataGlobal = []
            const checkedGlobal = []
            Object.values(executionReport.group).forEach((contentData) => {
                contentData.forEach((item) => {
                    contentDataGlobal.push(item)
                    if (item.isChecked) {
                        checkedGlobal.push(item)
                    }
                })
            })
            const progressPage = ((checked.length * 100) / contentData.length).toFixed(0)
            const globalProgress = ((checkedGlobal.length * 100) / contentDataGlobal.length).toFixed(0)
            setProgress({
                progressPage: progressPage,
                globalProgress: globalProgress
            })
            setOpened(false)
        }
    }, [contentData, executionReport])

    useEffect(() => {
        console.log(indexGroup)
    },[indexGroup])

    const handleContent = (i, element) => {
        setIndexGroup(element)
        setContentData(Object.values(executionReport.group)[i])
        const keysCache = [...gruposKeys]
        keysCache.forEach(key => {
            key.state = false
        })
        keysCache[i].state = true
        setGruposKeys(keysCache)
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


    const save = async (index, state, element) => {
        const contentDataCache = [...contentData]
        element.isChecked = true
        element.isWarning = state ? false : true
        contentDataCache[index] = element
        const executionReportCache = executionReport
        executionReportCache.group[indexGroup] = contentDataCache
        setContentData(contentDataCache)
        const {database} = await executionReportsDatabase.initDb()
        await executionReportsDatabase.actualizar(executionReportCache, database)
        if (isOnline) {
            await executionReportsRoutes.saveExecutionReport(executionReportCache)
        }
    } 

    const changeState = async (element, number) => {
        if (!element.isChecked) {
            if (confirm('¿Desea indicar estado ejecutado, sin dejar un mensaje?')) {
                const messages = [
                    {
                        content: "Se indica estado ejecutado sin dejar mensajes",
                        id: Date.now(),
                        name: `${userData.name} ${userData.lastName}`,
                        namePicture: null,
                        urlBase64: undefined,
                        user: userData._id,
                    }
                ]
                element.isChecked = true
                element.isWarning = false
                element.messages = messages
                save(number, true, element)
            }
        } else {
            if (confirm('Confirme que desea desmarcar la tarea')) {
                const contentDataCache = [...contentData]
                contentDataCache[number].isChecked = false
                let n = 0
                contentDataCache[number].messages.forEach((message, index) => {
                    if (message === 'Se indica estado ejecutado sin dejar mensajes') {
                        n = index
                    }
                })
                contentDataCache[number].messages[n] = null
                setContentData(contentDataCache)
                const executionReportCache = executionReport
                executionReportCache.group[indexGroup] = contentDataCache
                const {database} = await executionReportsDatabase.initDb()
                await executionReportsDatabase.actualizar(executionReportCache, database)
                if (isOnline) {
                    await executionReportsRoutes.saveExecutionReport(executionReportCache)
                }
            }
        }
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
                                        <Button style={{textAlign: 'center', width: '100%', height: 70}} onClick={() => handleContent(index, element.data/* gruposKeys, element */)}>
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
            <div
                style={
                    {
                        position: 'relative'
                    }
                }
            >
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
                    <Grid item xl={(report.reportType === 'Mantención') ? 3 : 5} md={(report.reportType === 'Mantención') ? 3 : 5} sm={4}>
                        <p style={{margin: 0, textAlign: 'center'}}> <strong>Observaciones</strong> </p>
                    </Grid>
                    <Hidden mdDown>
                        {(report.reportType === 'Mantención') && <Grid item xl={'auto'} md={'auto'}>
                            <p style={{margin: 0, textAlign: 'center', width: 100}}> <strong>N° Parte <br /> a Utilizar</strong> </p>
                        </Grid>}
                        {(report.reportType === 'Mantención') && <Grid item xl={'auto'} md={'auto'}>
                            <p style={{margin: 0, textAlign: 'center', width: 100}}> <strong>Cantidad <br /> a utilizar</strong> </p>
                        </Grid>}
                        {(report.reportType === 'Mantención') && <Grid item xl={'auto'} md={'auto'}>
                            <p style={{margin: 0, textAlign: 'center', width: 60}}> <strong>Cantidad <br /> Utilizada</strong> </p>
                        </Grid>}
                        {(report.reportType === 'Mantención') && <Grid item xl={1} md={1}>
                            <p style={{margin: 0, textAlign: 'center', width: 100}}> <strong>Tipo <br /> Rpto</strong> </p>
                        </Grid>}
                    </Hidden>
                    <Grid item xl={1} md={'auto'}>
                        <p style={{margin: 0, textAlign: 'center', width: 50}}> <strong>Acción</strong> </p>
                    </Grid>
                    <Grid item xl={1} md={1}>
                        <p style={{margin: 0, textAlign: 'center'}}> <strong>Estado</strong> </p>
                    </Grid>
                </Grid>
                <div style={{height: height, overflowY: 'scroll'}}>
                    {
                        contentData.map((e, n) => {
                            if (!e.isChecked) {
                                e.isChecked = false
                            }
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
                                    <Grid item xl={(report.reportType === 'Mantención') ? 3 : 5} md={(report.reportType === 'Mantención') ? 3 : 5} sm={4}>
                                        <p style={{fontSize: 12, padding: 5, margin: 0, textAlign: 'justify'}}> {e.obs01} </p>
                                    </Grid>
                                    <Hidden mdDown>
                                        {(report.reportType === 'Mantención') && <Grid item xl={'auto'} md={'auto'}>
                                            {(e.partnumberUtl === '*') ? <p style={{fontSize: 12, padding: 5, margin: 0, textAlign: 'center', width: 100}}>N/A</p> : <p style={{padding: 5, margin: 0, textAlign: 'center', width: 100}}>{e.partnumberUtl}</p>}
                                        </Grid>}
                                        {(report.reportType === 'Mantención') && <Grid item xl={'auto'} md={'auto'}>
                                            {(e.unidad === '*') ? <p style={{fontSize: 12, padding: 5, margin: 0, textAlign: 'center', width: 100}}>N/A</p> : <p style={{padding: 5, margin: 0, textAlign: 'center', width: 100}}> {e.cantidad} {e.unidad}</p>}
                                        </Grid>}
                                        {(report.reportType === 'Mantención') && <Grid item xl={'auto'} md={'auto'}>
                                            {(e.unidad === '*') ? <p style={{fontSize: 12, padding: 5, margin: 0, textAlign: 'center', width: 60}}>N/A</p> : <p style={{padding: 5, margin: 0, textAlign: 'center', width: 60}}> {e.unidadData ? e.unidadData : '___'} {e.unidad}</p>}
                                        </Grid>}
                                        {(report.reportType === 'Mantención') && <Grid item xl={1} md={1}>
                                            {(e.idtypeutlPartnumber === '*') ? <p style={{fontSize: 12, padding: 5, margin: 0, textAlign: 'center', width: 100}}>N/A</p> : <p style={{padding: 5, margin: 0, textAlign: 'center', width: 100}}> {e.idtypeutlPartnumber}</p>}
                                        </Grid>}
                                    </Hidden>
                                    <Grid item xl={1} md={'auto'}>
                                        <div style={{textAlign: 'center', width: 60}}>
                                            <IconButton style={{width: '5%', textAlign: 'center'}} onClick={()=>{openDialog(e, n); setIndexActivity(n)}}>
                                                <FontAwesomeIcon icon={canEdit ? faPen : faEye}/>
                                            </IconButton>
                                        </div>
                                    </Grid>
                                    <Grid item xl={1} md={1}>
                                        {
                                            !canEdit && (e.isChecked ? 
                                            <Checkbox 
                                            checked={e.isChecked} 
                                            disabled
                                            style={{transform: "scale(1.2)"}} 
                                            icon={<CircleUnchecked />} 
                                            checkedIcon={<CircleCheckedFilled style={{color: e.isWarning ? '#EAD749' : '#27AE60'}} />} 
                                            />
                                        :
                                            <Checkbox 
                                            checked={e.isChecked} 
                                            disabled 
                                            style={{transform: "scale(1.2)"}} 
                                            icon={<CircleUnchecked />} 
                                            checkedIcon={<CircleCheckedFilled style={{color: e.isWarning ? '#EAD749' : '#27AE60'}} />} 
                                            />)
                                        }
                                        {
                                            canEdit && (e.isChecked ? 
                                                <Checkbox 
                                                value={e.isChecked}
                                                checked={e.isChecked} 
                                                onClick={() => { changeState(e, n) }} 
                                                style={{transform: "scale(1.2)"}} 
                                                icon={<CircleUnchecked />} 
                                                checkedIcon={<CircleCheckedFilled style={{color: e.isWarning ? '#EAD749' : '#27AE60'}} />} 
                                                />
                                            :
                                                <Checkbox 
                                                value={e.isChecked}
                                                checked={e.isChecked} 
                                                onClick={() => { changeState(e, n) }} 
                                                style={{transform: "scale(1.2)"}} 
                                                icon={<CircleUnchecked />} 
                                                checkedIcon={<CircleCheckedFilled style={{color: e.isWarning ? '#EAD749' : '#27AE60'}} />} 
                                                />)
                                        }
                                        {e.haveMessage && <IconButton style={{padding: 5}} disabled><FontAwesomeIcon icon={faCommentDots} /></IconButton>}
                                        {!e.messages && <IconButton style={{padding: 5}} disabled><FontAwesomeIcon style={{color: 'transparent'}} icon={faCommentDots} /></IconButton>}
                                        {e.haveClip && <IconButton style={{padding: 5}} disabled><FontAwesomeIcon icon={faPaperclip} /></IconButton>}
                                        {!e.haveClip && <IconButton style={{padding: 5}} disabled><FontAwesomeIcon style={{color: 'transparent'}} icon={faPaperclip} /></IconButton>}
                                    </Grid>
                                </Grid>
                            )
                        })
                    }
                </div>
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
                    canEdit={canEdit}
                />}
                {
                    loadingLogo && <LoadingLogoModal open={loadingLogo} />
                }
            </div>
        </div>
    )
}

export default PautaDetail

