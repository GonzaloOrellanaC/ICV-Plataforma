export default (time) => {
    if (time) {
        const dateTest = new Date(time).toISOString()
        const date = new Date(dateTest)
        return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES')
    } else {
        return 'Sin información'
    }
}