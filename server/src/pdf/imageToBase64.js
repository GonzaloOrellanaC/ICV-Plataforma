import Compressor from 'compressorjs'
export const imageToBase64 = (image) => {
    return new Promise(resolve => {
        new Compressor(image, {
            quality: 0.5,
            success: (compressedResult) => {
                var reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result)
                }
                reader.readAsDataURL(compressedResult);
            }
        })
        
    })
}