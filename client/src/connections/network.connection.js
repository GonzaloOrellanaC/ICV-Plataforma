

const detectNetwork = () => {
    return new Promise(resolve => {
        try {
            fetch('https://api.publicapis.org/entries', {method: 'GET', mode: "no-cors"})
            .then(response => {
                console.log(response)
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
