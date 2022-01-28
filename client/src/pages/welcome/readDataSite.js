import logout from './logout';
import hour from './hour'
import fecha from './date'
import { environment } from '../../config';

export default (
    setDisableButtons,
    setNotificaciones1,
    setNotificaciones2,
    setDisableButtonsNoSAP,
    setDisableIfNoMaintenance,
    setDisableIfNoInspection,
    setHora,
    setDate
     ) => {
        if(localStorage.getItem('sitio')) {
            setDisableButtons(false)
        }else{
            setNotificaciones1('Para navegar en la aplicación debe seleccionar una obra')
        }
        if((localStorage.getItem('role') === 'admin') || (localStorage.getItem('role') === 'sapExecutive')) {
            setDisableButtonsNoSAP(false);
        }else{
            setNotificaciones2('Solo Roles "Admin" o "Ejecutivo SAP" puede administrar usuarios.');
            if(localStorage.getItem('role') === 'maintenceOperator') {
                setDisableIfNoMaintenance(false)
            }else{
                setDisableIfNoMaintenance(true)
            };
            if(localStorage.getItem('role') === 'inspectionWorker') {
                setDisableIfNoInspection(false)
            }else{
                setDisableIfNoInspection(true)
            };
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