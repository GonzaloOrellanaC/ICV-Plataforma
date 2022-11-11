import logout from './logout';
import hour from './hour'
import fecha from './date'
import { environment } from '../../config';

export default (
    setDisableButtons,
    setNotificaciones2,
    setDisableButtonsNoSAP,
    setDisableIfNoMaintenance,
    setDisableIfNoInspection,
    setDisableButtonNoAdmin,
    setHora,
    setDate,
     ) => {
        if(localStorage.getItem('sitio')) {
            setDisableButtons(false)
        }else{
            
        }
        if((localStorage.getItem('role') === 'admin') || (localStorage.getItem('role') === 'superAdmin')) {
            setDisableButtonNoAdmin(false)
        }else {
            
        }
        if(
            (localStorage.getItem('role') === 'admin') || 
            (localStorage.getItem('role') === 'superAdmin') || 
            (localStorage.getItem('role') === 'sapExecutive') || 
            (localStorage.getItem('role') === 'shiftManager') || 
            (localStorage.getItem('role') === 'chiefMachinery')
            )
        {
            setDisableButtonsNoSAP(false)
        } else {
            if(localStorage.getItem('role') === 'maintenceOperator') {
                setDisableIfNoMaintenance(false)
            }else{
                setDisableIfNoMaintenance(true)
            }
            if(localStorage.getItem('role') === 'inspectionWorker') {
                setDisableIfNoInspection(false)
            }else{
                setDisableIfNoInspection(true)
            }
            if(localStorage.getItem('roles')) {
                setDisableIfNoInspection(true)
                setDisableIfNoInspection(true)
                const roles = JSON.parse(localStorage.getItem('roles'))
                roles.map(rol => {
                    if (rol === 'maintenceOperator') {
                        setDisableIfNoMaintenance(false)
                    } else if (rol === 'inspectionWorker') {
                        setDisableIfNoInspection(false)
                    } else if ((rol === 'admin')||(rol === 'superAdmin')) {
                        setDisableButtonNoAdmin(false)
                    } else if ((rol === 'admin')||(rol === 'superAdmin')||(rol === 'sapExecutive')||(rol === 'shiftManager')||(rol === 'chiefMachinery')) {
                        setDisableButtonsNoSAP(false)
                    }
                })
            }
        }
        if(localStorage.getItem('version')) {
            if((localStorage.getItem('version') != environment.version)) {
                alert('Plataforma requiere actualización. Se cerrará sesión para actualizar el servicio.');
                logout()
            }
        }
        
        setDate(fecha(Date.now()));
        const interval = setInterval(() => {
            setHora(hour(Date.now()))
        }, 100);
        return () => clearInterval(interval);
    
}