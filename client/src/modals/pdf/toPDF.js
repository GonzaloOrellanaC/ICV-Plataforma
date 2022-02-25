import { dateSimple, getExecutionReportData, getUserNameById } from "../../config";
import { pdfMakeRoutes } from "../../routes";
import logo from '../../assets/logo_icv_gris.png';

const createTable = ( groupKeys = new Array, group = new Array) => {
    let arrayTable = []
    return new Promise(resolve => {
        group.forEach(async (element, index) => {
            console.log(element, groupKeys[index]);
            arrayTable.push(
                {
                    style: 'title',
                    table: {
                        widths: [50, 120, 120, '*'],
                        body: 
                            await createSubTables(element, groupKeys[index], index),
                            
                        
                    }/* ,
                    layout: {
                        fillColor: '#DADADA'
                    } */
                },

            );
            if(index == (group.length - 1)) {
                resolve(arrayTable)
            }
        })
    })
}

const createSubTables = (list = new Array, index = new String, indexNumber = new Number) => {
    let pageBreak;
    if(indexNumber == 0) {
        pageBreak = 'none'
    }else{
        pageBreak = 'before'
    }
    let table = [
        [
            {
                colSpan: 4, 
                border: [true, true, true, true],
                text: index,
                fillColor: '#DADADA',
                pageBreak: pageBreak
            },
            {},
            {},
            {}
        ]
    ];
    //table = table.push(['hola', 'que tal', 'como va', 'quien eres'])
    return new Promise(resolve => {
        list.forEach((e, i) => {
            let commit
            if(e.writeCommits) {
                commit = `${e.writeCommits[0].userName}: ${e.writeCommits[0].commit}`
            }else{
                commit = `Observación: -- ${e.readCommits[0].userName}: ${e.readCommits[0].commit}`
            }
            
            table.push([e.workteamdesc,  e.taskdesc ,  e.obs01 , commit])
            if(i == (list.length - 1)) {
                resolve(table)
            }
        })
    })
}

export default async (reportData, machineData) => {
    //console.log(reportData);
    //console.log(machineData);
    const admin = await getUserNameById(reportData.createdBy);
    const executionReportData = await getExecutionReportData(reportData);
    //console.log(executionReportData);
    //if(executionReportData) {
        const groupKeys = Object.keys(executionReportData[0].group)
        const group = Object.values(executionReportData[0].group);
        //createTable(groupKeys, group)
    //}
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
                    widths: [50, 120, 120, '*'],
                    body: [
                        ['Personal Necesario', 'Descripción de la tarea', 'Observaciones', 'Comentarios']
                    ]
                },
                layout: {
                    fillColor: '#DADADA'
                }
            },
            await createTable(groupKeys, group),
            {
                columns: [
                    {
                        text: 'Responsables: ',
                        margin: [0, 50, 0, 0],
                    },
                    {
                        alignment: 'right',
                        margin: [0, 50, 0, 0],
                        width: '*',
                        text: 'Fecha __ / __ / ____'
                    }
                ]
            },
            {
                columns: [
                    {
                        alignment: 'center',
                        margin: [0, 200, 0, 200],
                        width: '*',
                        text: 'Firma Ejecutivo SAP'
                    },
                    {
                        alignment: 'center',
                        margin: [0, 200, 0, 200],
                        width: '*',
                        text: 'Firma Jefe de Maquinaria'
                    },
                    {
                        alignment: 'center',
                        margin: [0, 200, 0, 200],
                        width: '*',
                        text: 'Firma Jefe de Turno'
                    },
                    {
                        alignment: 'center',
                        margin: [0, 200, 0, 200],
                        width: '*',
                        text: 'Firma Técnico Inspección o Mantenimiento'
                    },
                ]
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

    console.log(docDefinition)
    
    pdfMakeRoutes.createPdf(docDefinition).then(data=> {
        const linkSource = data.data;
        let a = document.createElement("a");
        a.href = linkSource;
        a.download = `Orden_de_trabajo_${reportData.idIndex}_aprobado.pdf`
        a.click();
    })
    
}
