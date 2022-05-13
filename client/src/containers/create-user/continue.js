export default (
    userDataToContinue, 
    setRut,
    setName,
    setLastName,
    setEmail,
    setPhone,
    setUserType,
    setSiteToUser,
    setPassword,
    setConfirmPassword,
    setImageUrl ) => {
    if(userDataToContinue) {
        setTimeout(() => {
            let data = JSON.parse(userDataToContinue);
            if(data.rut) {
                setRut(data.rut)
            }
            if(data.name) {
                setName(data.name)
            }
            if(data.lastName) {
                setLastName(data.lastName)
            }
            if(data.email) {
                setEmail(data.email)
            }
            if(data.phone) {
                setPhone(data.phone);
                if(data.phone.length > 0) {
                    if(userData.phone.length == 9) {
                        document.getElementById('phone').className = 'isValid';
                    }else {
                        document.getElementById('phone').className = 'isInvalid';
                    }
                }
            }
            if(data.role) {
                setUserType(data.role)
            }
            if(data.sites) {
                setSiteToUser(data.sites)
            }
            if(data.password && (typeDisplay === 'Nuevo usuario')) {
                setPassword(data.password)
            }
            if(data.confirmPassword && (typeDisplay === 'Nuevo usuario')) {
                setConfirmPassword(data.confirmPassword)
            }
            if(data.imageUrl) {
                setImageUrl(data.imageUrl)
            }
        }, 500);
        
    };
}