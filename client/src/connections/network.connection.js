

const detectNetwork = () => {
    return new Promise(resolve => {
        try {
            fetch('https://ztudy-prendoaprendo-backend.firebaseapp.com/api/timestamp', {method: 'GET', mode: "no-cors"})
            .then(response => {
                resolve(true)
            }, errorData => {
                resolve(false)
            }).catch(err=>{
                resolve(false)
            })
        } catch ( error ) {
            resolve(false)
        }
    })
}

export default  {
    detectNetwork
}
