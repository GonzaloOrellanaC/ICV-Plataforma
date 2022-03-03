export default (time) => {
    let hr = new Date(time).getHours();
    let min = new Date(time).getMinutes();
    if(hr < 10) {
        hr = '0' + hr;
    }
    if(min < 10) {
        min = '0' + min
    }
    if(!time) {
        return 'Sin información'
    }else{
        return(hr + ':' + min)
    }
}