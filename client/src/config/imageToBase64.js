export default (image) => {
    return new Promise(resolve => {
        var reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.readAsDataURL(image);
    })
    
    /* let base64String = '' */
    /* return new Promise (resolve => {
        let reader = new FileReader();
        reader.onloadend = () => {
            base64String = reader.result.replace('data:', '').replace(/^.+,/, "");
        };
        resolve(reader.readAsDataURL(image))
    }) */
}