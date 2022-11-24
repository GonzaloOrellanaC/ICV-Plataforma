import { usersRoutes } from "../routes"

const getImageBase64 = (imageUrl) => {
    return new Promise(resolve => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            console.log(img.width, img.height)
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            console.log(ctx)
            const dataURL = canvas.toDataURL("image/jpeg");
            resolve(dataURL)
        }
        img.onerror = () => {
            console.log('error')
            resolve(null)
        }
        img.src = imageUrl
    })
}

const getSignById = (_id) => {
    if(_id) {
        return new Promise(async resolve => {
            let sign = await usersRoutes.getUserSign(_id)
            console.log(sign)
            if (sign.data.length > 0) {
                resolve(sign.data)
            } else {
                const signAlternative = await getImageBase64('https://icvmantencion.blob.core.windows.net/plataforma-mantencion/assets/firma.jpg')
                resolve(signAlternative)
            }
        })
    }else{
        return new Promise(resolve => {
            resolve('Sin información')
        })
    }
}

export default getSignById
