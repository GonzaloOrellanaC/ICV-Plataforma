export default () => {
    if(localStorage.getItem('role') === 'superAdmin') {
        return false
    } else {
        return true
    }
}