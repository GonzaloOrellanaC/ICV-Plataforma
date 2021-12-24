

export default (time) => {
    let day = new Date(time).getDay();
    let dayName;
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
    let date = new Date(time).getDate()
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
    return (dayName + ' ' + date + ' DE ' + monthName).toUpperCase()
}