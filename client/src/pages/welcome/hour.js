export default (time) => {
    let hora = ""
    let minutos = ""

    let minutes = new Date(time).getMinutes();
    let hr = new Date(time).getHours();
    let minString
    if(minutes < 10) {
        minString = '0'+minutes
    }else{
        minString = minutes
    }
    minutos = minString;
    let hrString
    if(hr < 10) {
        hrString = '0'+hr
    }else{
        hrString = hr
    }
    hora = hrString;
    return(`${hora}:${minutos}`)
}