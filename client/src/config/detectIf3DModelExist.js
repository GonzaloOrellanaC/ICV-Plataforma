export default (value = new String, machineModel = new String) => {
    console.log(value, machineModel)
    if(machineModel === 'PC5500') {
        if(
            (value === 'Motor') ||
            (value === 'Mando Final') ||
            (value === 'Rodado') ||
            (value === 'PTO') ||
            (value === 'Neumáticos') ||
            (value === 'Hidráulico') ||
            (value === 'Mando de Giro') ||
            (value === 'Chassis') ||
            (value === 'Cabina') ||
            (value === 'Implementos') ||
            (value === 'Eléctrico')
        ) {
            return true
        } else {
            return false
        }
    } else if (machineModel === '793-F') {
        if(
            (value === 'Motor') ||
            (value === 'Transmisión') ||
            (value === 'Ejes') ||
            /* (value === 'PTO') || */
            (value === 'Neumáticos') ||
            (value === 'Hidráulico') ||
            (value === 'Dirección') ||
            (value === 'Chassis') ||
            (value === 'Cabina') ||
            (value === 'Mazas') ||
            (value === 'Sistema Neumático') ||
            (value === 'Suspensión')
        ) {
            return true
        } else {
            return false
        }
    }
}