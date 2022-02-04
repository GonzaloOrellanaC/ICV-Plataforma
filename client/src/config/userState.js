export default (userRole) => {
    if(userRole === localStorage.getItem('role')) {
        return true
    }else{
        return false
    }
}