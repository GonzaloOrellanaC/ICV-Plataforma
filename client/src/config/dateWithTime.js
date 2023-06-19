export default (time) => {
    if (time) {
        console.log(time)
        const dateTest = new Date(time).toISOString()
        console.log('Fecha!: ', dateTest)
        const date = new Date(dateTest)
        return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES')
    } else {
        return 'Sin información'
    }
}