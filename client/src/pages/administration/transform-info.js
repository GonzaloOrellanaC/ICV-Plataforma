

export default (info) => {
    return new Promise(resolve => {
        if(info === 'name') {
            resolve('Nombre de usuario')
        }else if(info === 'lastName') {
            resolve('Apellido de usuario')
        }else if(info === 'rut') {
            resolve('RUT de usuario')
        }else if(info === 'role') {
            resolve('Tipo de usuario')
        }else if(info === 'email') {
            resolve('Email / Correo electrónico de usuario')
        }else if(info === 'phone') {
            resolve('Teléfono')
        }else if(info === 'password') {
            resolve('Contraseña')
        }else if(info === 'sites') {
            resolve('Obra')
        }else if(info === 'confirmPassword') {
            resolve('Confirmación de la contraseña')
        }
    })
}