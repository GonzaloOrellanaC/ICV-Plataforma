import { dateSimple, getExecutionReportData, getUserNameById } from "../../config";
import { pdfMakeRoutes } from "../../routes";
import logo from '../../assets/logo_icv_gris.png'

export default async (reportData, machineData) => {
    console.log(reportData);
    console.log(machineData);
    const admin = await getUserNameById(reportData.createdBy);
    const executionReportData = await getExecutionReportData(reportData);
    console.log(executionReportData)
    var docDefinition = {
        content: [
            {
                columns: [
                    {
                        alignment: 'left',
                        text: 'DEPTO DE CONTROL Y GESTIÓN DE MAQUINARIA',
                        style: 'deptoInfo',
                        width: 100,
                    },
                    {
                        alignment: 'center',
                        text: `ORDEN DE TRABAJO ${reportData.idIndex} \n PAUTA DE ${reportData.reportType}`.toUpperCase() , 
                        style: 'subheader',
                        width: '*'
                    },
                    {
                        width: 100,
                        columns: [
                            {
                                width: '*',
                                text: ''
                            },
                            {
                                alignment: 'right',
                                image: logo,
                                width: 60
                            }
                        ]
                    }
                ]
            },
            {
                columns: [
                    {
                        width: 150,
                        style: 'table',
                        table: {
                            body: [
                                ['Tipo', `${machineData.type}`],
                                ['Marca', `${machineData.brand}`],
                                ['Modelo', `${machineData.model}`],
                                ['N°', `${machineData.equ}`]
                            ]
                        }
                    },
                    {
                        width: 170,
                        columns: [
                            {
                                width: '*',
                                text: ''
                            },
                            {
                                width: 50,
                                style: 'table',
                                table: {
                                    body: [
                                        ['Equipos', `TODOS`],
                                        ['Pauta', `${reportData.idPm}`]
                                    ]
                                }
                            },
                            {
                                width: '*',
                                text: ''
                            },
                        ]
                    },
                    {
                        width: 170,
                        columns: [
                            {
                                width: '*',
                                text: ''
                            },
                            {
                                width: 70,
                                style: 'table',
                                table: {
                                    body: [
                                        ['Fecha Creación: ', `${dateSimple(reportData.createdAt)}`],
                                        ['Creado por: ', `${admin}`]
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            {
                style: 'title',
                table: {
                    widths: [50, '*', 150, 70],
                    body: [
                        ['Personal Necesario', 'Descripción de la tarea', 'Observaciones', 'Ejecutado']
                    ]
                },
                layout: {
                    fillColor: '#DADADA'
                }
            },
            {
                style: 'title',
                table: {
                    widths: ['*'],
                    body: [
                        ['Indicaciones Iniciales']
                    ]
                },
                layout: {
                    fillColor: '#DADADA'
                }
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            deptoInfo: {
                fontSize: 8,
                bold: false,
                margin: [10, 10, 10, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            table: {
                margin: [0, 5, 0, 15],
                fontSize: 8
            },
            title: {
                margin: [0, 5, 0, 15],
                fontSize: 10,
                bold: 'true',
                alignment: 'center'
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        },
    };
    
    pdfMakeRoutes.createPdf(docDefinition).then(data=> {
        const linkSource = data.data;
        let a = document.createElement("a");
        a.href = linkSource;
        a.download = `Orden_de_trabajo_${reportData.idIndex}_aprobado.pdf`
        a.click();
    })
    
}
