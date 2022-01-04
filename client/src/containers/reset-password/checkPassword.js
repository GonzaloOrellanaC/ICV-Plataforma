export default (password) => {
    var strengthbar = document.getElementById("meter");

    var strength = 0;
    if (password.match(/[a-z]+/)) {
      strength += 1;
    }
    if (password.match(/[A-Z]+/)) {
      strength += 1;
    }
    if (password.match(/[0-9]+/)) {
      strength += 1;
    }
    if (password.match(/[$@#&!]+/)) {
      strength += 1;
  
    }
  
    /* if (password.length < 6) {
      display.innerHTML = "minimum number of characters is 6";
    }
  
    if (password.length > 12) {
      display.innerHTML = "maximum number of characters is 12";
    } */
  
    switch (strength) {
      case 0:
        strengthbar.value = 0;
        strengthbar.className = 'nivelBajo';
        break;
  
      case 1:
        strengthbar.value = 25;
        strengthbar.className = 'nivelMedioBajo';
        break;
  
      case 2:
        strengthbar.value = 50;
        strengthbar.className = 'nivelMedio';
        break;
  
      case 3:
        strengthbar.value = 75;
        strengthbar.className = 'nivelMedioAlto';
        break;
  
      case 4:
        strengthbar.value = 100;
        strengthbar.className = 'nivelAlto';
        break;
    }
  }