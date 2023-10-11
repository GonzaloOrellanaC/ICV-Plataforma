import { environment } from "../config";
import { InsumosPorReporte } from "../models";
import ExecutionReport from "../models/executionReport";
import Reports from "../models/reports";

const insumosPorReporte = async (req, res) => {
    if (req.headers.authorization) {
        if (req.headers.authorization === environment.forExternalApi) {
            const {om} = req.query;
            const insumoPorOMCreado = await InsumosPorReporte.findOne({om:om})
            if (insumoPorOMCreado) {
                const dataToSend = {
                    om: insumoPorOMCreado.om,
                    ejecucionDeReporte: insumoPorOMCreado.ejecucionDeReporte,
                    datosReporte: insumoPorOMCreado.datosReporte
                }
                res.status(200).send({message: 'Datos compilados', data: dataToSend, state: true})
            } else {
                const report = await Reports.findOne({sapId: om})
                console.log(report)
                if (!report) {
                    res.status(404).send({message: 'Orden de Trabajo no encontrado.', state: false})
                } else {
                    if (!report.level) {
                        res.status(404).send({message: 'OM solicitada aún no ha sido iniciada.', state: false})
                    } else if (report.level === 1) {
                        res.status(404).send({message: 'OM solicitada en ejecución por operario.', state: false})
                    } else if (report.level > 1 && report.level < 4) {
                        res.status(404).send({message: 'OM solicitada en proceso de revisión.', state: false})
                    } else {
                        const ejecucionDeReporte = await ExecutionReport.findOne({reportId: report._id})
                        if (!ejecucionDeReporte) {
                            res.status(404).send({message: 'OM solicitada no cuenta con ejecución.', state: false})
                        } else {
                            const listaMateriales = []
                            Object.keys(ejecucionDeReporte.group).forEach(async (element, index) => {
                                const hoja = {
                                    nombre: element,
                                    data: []
                                }
                                ejecucionDeReporte.group[element].forEach((item, i) => {
                                    if (item.unidad === '*') {
        
                                    } else {
                                        const materialData = {
                                            task: item.task,
                                            taskdesc: item.taskdesc,
                                            obs01: item.obs01,
                                            partnumberUtl: item.partnumberUtl,
                                            cantidad: item.cantidad,
                                            unidad: item.unidad,
                                            unidadData: item.unidadData ? Number(item.unidadData) : 0,
                                            diferencia: parseFloat(item.cantidad.toString()) - parseFloat(item.unidadData ? item.unidadData.toString() : '0')
                                        }
                                        hoja.data.push(materialData)
                                    }
                                    if (i === (ejecucionDeReporte.group[element].length - 1)) {
                                        if (hoja.data.length > 0) {
                                            listaMateriales.push(hoja)
                                        }
                                    }
                                })
                                if (index === (Object.keys(ejecucionDeReporte.group).length - 1)) {
                                    const dataToSend = {
                                        om: report.sapId,
                                        ejecucionDeReporte: listaMateriales,
                                        datosReporte: {
                                            ot: report.idIndex,
                                            maquina: report.machine,
                                            idObra: report.site,
                                            idPm: report.idPm,
                                            fechaInicioProgramado: report.datePrev,
                                            fechaCierreProgramado: report.endPrev,
                                            fechaInicioEfectivo: report.dateInit,
                                            fechaTerminoEjecucion: report.endReport,
                                            fechaCierre: report.dateClose,
                                            documento: report.urlPdf
                                        }
                                    }
                                    await InsumosPorReporte.create(dataToSend)
                                    res.status(200).send({message: 'Datos compilados', data: dataToSend, state: true})
                                }
                            })
                        }
                    }
                }
            }    
        } else {  
            res.status(404).send({message: 'Codigo de autenticación incorrecto.', state: false})
        }
    } else {
        res.status(404).send({message: 'Codigo de autenticación vacío.', state: false})
    }
}

export default {
    insumosPorReporte
}