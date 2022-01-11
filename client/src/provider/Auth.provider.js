const authProvider = {
    login: ( email, password ) =>  {
            authRoutes.login(email, password)
            .then(response => {
                setUserData(response.data.userInfo);
                sessionStorage.setItem('email', response.data.userInfo.email);
                sessionStorage.setItem('fullName', response.data.userInfo.fullName);
                sessionStorage.setItem('name', response.data.userInfo.name);
                sessionStorage.setItem('lastName', response.data.userInfo.lastName);
                sessionStorage.setItem('_id', response.data.userInfo._id);
                setTimeout(() => {
                    setIsAuthenticated(true)
                    window.localStorage.setItem('isauthenticated', true)
                }, 500);
                
            })
            .catch(error => {
                setIsAuthenticated(false)
                window.localStorage.setItem('isauthenticated', false)
            })
    },
    checkAuth: () => {
        // Required for the authentication to work
        
    },
    getPermissions: () => {
        // Required for the authentication to work
        
    },
    // ...
};

export default authProvider;
