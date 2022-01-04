export default (inputText) => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(inputText.match(mailformat)){
        //alert("Valid email address!");
        document.getElementById('rut').className = 'isValid';
        return true;
    }else{
        //alert("You have entered an invalid email address!");
        document.getElementById('rut').className = 'isInvalid';
        return false;
    }
}