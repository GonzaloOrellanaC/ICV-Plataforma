export default (level, role) => {
    if(level == 1 && role === 'shiftManager') {
        return true
    }else if(level == 2 && role === 'chiefMachinery') {
        return true
    }else if(level == 3 && role === 'sapExecutive') {
        return true
    }else{
        return false
    }
}