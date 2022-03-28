import { SocketConnection } from "../../connections"

export default (emailing, idIndex) => {
    let message;
    let url;
    if(emailing === 'termino-orden-1') {
        message = `OT ${idIndex} deberá ser revisada por Jefe de Turno`
        url = '/assignment'
    }else if(emailing === 'termino-orden-2') {
        message = `OT ${idIndex} deberá ser revisada por Jefe de Maquinaria`
        url = '/assignment'
    }else if(emailing === 'termino-orden-3') {
        message = `OT ${idIndex} deberá ser revisada por Ejecutivo SAP`
        url = '/assignment'
    }else if(emailing === 'termino-orden-4') {
        message = `OT ${idIndex} Ha sido cerrada por Ejecutivo SAP`
        url = '/reports'
    }
    SocketConnection.sendnotificationToManyUsers(
        emailing,
        `${localStorage.getItem('_id')}`,
        'Ejecuciones OT',
        `Se ha terminado de ejecutar OT ${idIndex}`,
        message,
        url
        )
}