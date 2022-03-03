export default (image) => {
    return new Promise(resolve => {
        var reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.readAsDataURL(image);
    })
}