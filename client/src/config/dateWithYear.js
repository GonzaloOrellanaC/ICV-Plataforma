

export default (time) => {
    if(!time) {
        return ('Sin información').toUpperCase()
    }else{
        let day = new Date(time).getDay()
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
        /* 
        
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
        }else if(day == 7) {
            dayName = 'Domingo'
        }
        */
        let date = new Date(time).getUTCDate();
        let month = new Date(time).getMonth();
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
        let year = new Date(time).getUTCFullYear();
        return `${date}-${monthName}-${year}`
        /* return (dayName + ' ' + date + ' DE ' + monthName + ', ' + year).toUpperCase() */
    }
}