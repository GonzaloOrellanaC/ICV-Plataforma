export default (value = new String()) => {
    if(value === 'Neumáticos') {
        return 'Neumaticos'
    } else if(value === 'Chassis') {
        return 'Chasis'
    } else if(value === 'Dirección') {
        return 'Sistema_direccion'
    } else if(value === 'Sistema Neumático') {
        return 'Sistema_neumatico'
    } else if(value === 'Hidráulico') {
        return 'Sistema_hidraulico'
    } else if(value === 'Suspensión') {
        return 'Suspension'
    } else if(value === 'Mazas') {
        return 'Maza'
    } else if((value === 'Transmisión')||(value === 'Ejes')) {
        return 'Transmision'
    } else if((value === 'Mando Final')) {
        return 'Mando_final'
    } else if((value === 'Mando de Giro')) {
        return 'Mando_de_giro'
    } else if((value === 'Rodado')) {
        return 'Sistema_rodado'
    } else if((value === 'Eléctrico')) {
        return 'Electrico'
    } else if((value === 'Implementos')) {
        return 'Implemento'
    } else {
        return value
    }
}