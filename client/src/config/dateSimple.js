export default (time) => {
    let date = new Date(time).getDate();
    let month = new Date(time).getMonth() + 1;
    let year = new Date(time).getFullYear();
    if(month < 10) {
        month = '0' + month
    }
    if(date < 10) {
        date = '0' + date
    }
    if(!time) {
        return('No informado')
    }else{
        return (date + '/' + month +'/' + year)
    }
}