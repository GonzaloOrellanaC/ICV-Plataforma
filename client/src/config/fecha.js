export const fechaDia = (time) => {
    if (time) {
        const fecha = new Date(time).toISOString()
        const dia = new Date(fecha).getUTCDate();
        return dia
    } else {
        return 'Sin fecha'
    }
}

export const fechaMes = (time) => {
    if (time) {
        const fecha = new Date(time).toISOString()
        const mes = new Date(fecha).getMonth();
        return mes + 1
    } else {
        return 'Sin fecha'
    }
}

export const fechaAno = (time) => {
    if (time) {
        const fecha = new Date(time).toISOString()

        const ano = new Date(fecha).getUTCFullYear();
        return ano
    } else {
        return 'Sin fecha'
    }
}

export const fechaCompleta = (time) => {
    if(time) {
        const fecha = new Date(time).toISOString()
        let day = new Date(fecha).getDay()
        let dayName;
        if(day === 0) {
            dayName = 'Dom'
        }else if(day === 1) {
            dayName = 'Lun'
        }else if(day === 2) {
            dayName = 'Mar'
        }else if(day === 3) {
            dayName = 'Mie'
        }else if(day === 4) {
            dayName = 'Jue'
        }else if(day === 5) {
            dayName = 'Vie'
        }else if(day === 6) {
            dayName = 'Sab'
        }
        
        let date = new Date(fecha).getUTCDate();
        let month = new Date(fecha).getMonth();
        let monthName
        if(month == 0) {
            monthName = 'Jan'
        }else if(month == 1) {
            monthName = 'Feb'
        }else if(month == 2) {
            monthName = 'Mar'
        }else if(month == 3) {
            monthName = 'Apr'
        }else if(month == 4) {
            monthName = 'May'
        }else if(month == 5) {
            monthName = 'Jun'
        }else if(month == 6) {
            monthName = 'Jul'
        }else if(month == 7) {
            monthName = 'Aug'
        }else if(month == 8) {
            monthName = 'Sep'
        }else if(month == 9) {
            monthName = 'Oct'
        }else if(month == 10) {
            monthName = 'Nov'
        }else if(month == 11) {
            monthName = 'Dic'
        }
        let year = new Date(fecha).getUTCFullYear();
        return `${date}-${monthName}-${year}`
    }else{
        return 'Sin fecha'
    }
}

export const leerHora = (time) => {
    if (dateIsValid(time)) {
        const fecha = new Date(time).toISOString()
        const horaLocal = new Date(fecha)
        const hora = horaLocal.getHours()
        const minutos = (horaLocal.getMinutes() < 10) ? `0${horaLocal.getMinutes()}` : horaLocal.getMinutes()
        return `${hora}:${minutos}`
    } else {
        return '-'
    }
}

const dateIsValid = (date) => {
    return !Number.isNaN(new Date(date).getTime());
}