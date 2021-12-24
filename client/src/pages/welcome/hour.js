import { useState } from "react";

export default (time) => {
    /* const [ hora, setHr ] = useState('')
    const [ min, setMin ] = useState('') */

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
    setInterval(() => {
        let newTime = Date.now()
        if(minutes != new Date(newTime).getMinutes()){
            minutes = new Date(newTime).getMinutes()
            if(minutes < 10) {
                minString = '0'+minutes
            }else{
                minString = minutes
            }
            minutos = minString
        }
        if(hr != new Date(newTime).getHours()){
            hr = new Date(newTime).getHours()
            if(hr < 10) {
                hrString = '0'+hr
            }else{
                hrString = hr
            }
            hora = hrString;
        }
    }, 1000);
    return(`${hora}:${minutos}`)

}