

export default (time) => {
    let toDay = Date.now();

    let hr = new Date(time).getHours();
    let min = new Date(time).getMinutes();

    if(hr < 10) {
        hr = '0'+hr;
    }

    if(min < 10) {
        min = '0'+min
    }


    let day = new Date(time).getDay();
    let dayName;
    if((day == new Date(toDay).getDay())&&(day < (toDay - 259200000))) {
        dayName = 'Hoy'
    }else if((day == (new Date(toDay).getDay() - 1))&&(day < (toDay - 259200000))){
        dayName = 'Ayer'
    }else{
        if(day == 1) {
            dayName = 'Lunes'
        }else if(day == 2) {
            dayName = 'Martes'
        }else if(day == 3) {
            dayName = 'Miercoles'
        }else if(day == 4) {
            dayName = 'Jueves'
        }else if(day == 5) {
            dayName = 'Viernes'
        }else if(day == 6) {
            dayName = 'Sabado'
        }else if(day == 0) {
            dayName = 'Domingo'
        }
    }
     
    let date = new Date(time).getDate() + 1;
    let month = new Date(time).getMonth();
    let monthName
    if(month == 0) {
        monthName = 'Enero'
    }else if(month == 1) {
        monthName = 'Febrero'
    }else if(month == 2) {
        monthName = 'Marzo'
    }else if(month == 3) {
        monthName = 'Abril'
    }else if(month == 4) {
        monthName = 'Mayo'
    }else if(month == 5) {
        monthName = 'Junio'
    }else if(month == 6) {
        monthName = 'Julio'
    }else if(month == 7) {
        monthName = 'Agosto'
    }else if(month == 8) {
        monthName = 'Septiembre'
    }else if(month == 9) {
        monthName = 'Octubre'
    }else if(month == 10) {
        monthName = 'Noviembre'
    }else if(month == 11) {
        monthName = 'Diciembre'
    } 
    if(!time) {
        return 'Sin información'
    }else{
        if((dayName === 'Hoy')||(dayName === 'Ayer')) {
            return(dayName + ' ' + hr + ':' + min)
        }else{
            return (dayName + ' ' + date + ' DE ' + monthName + ' ' + hr + ':' + min)
        }
    }
}