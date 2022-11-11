export default (level, role) => {
    const isSapExecutive = Boolean(localStorage.getItem('isSapExecutive'))
    const isShiftManager = Boolean(localStorage.getItem('isShiftManager'))
    const isChiefMachinery = Boolean(localStorage.getItem('isChiefMachinery'))
    if(level == 1 && (role === 'shiftManager'||isShiftManager)) {
        return true
    }else if(level == 2 && (role === 'chiefMachinery'||isChiefMachinery)) {
        return true
    }else if(level == 3 && (role === 'sapExecutive' || role === 'admin' || isSapExecutive)) {
        return true
    }else{
        return false
    }
}