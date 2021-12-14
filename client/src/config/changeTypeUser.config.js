export const changeTypeUser = (userType) => {
    if(userType === 'superAdmin') {
        return 'Super Administrador'
    }else if(userType === 'sapExecutive') {
        return 'Ejecutivo SAP'
    }else if(userType === 'inspectionWorker') {
        return 'Operario de Inspección'
    }else if(userType === 'maintenceOperator') {
        return 'Operario de Mantención'
    }else if(userType === 'shiftManager') {
        return 'Jefe de turno - Inspección y Mantención'
    }else if(userType === 'chiefMachinery') {
        return 'Jefe de maquinaria'
    } 
}

export const returnTypeUser = (userType) => {
    if(userType === 'Super Administrador') {
        return 'superAdmin'
    }else if(userType === 'Ejecutivo SAP') {
        return 'sapExecutive'
    }else if(userType === 'Operario de Inspección') {
        return 'inspectionWorker'
    }else if(userType === 'Operario de Mantención') {
        return 'maintenceOperator'
    }else if(userType === 'Jefe de turno - Inspección y Mantención') {
        return 'shiftManager'
    }else if(userType === 'Jefe de maquinaria') {
        return 'chiefMachinery'
    } 
}