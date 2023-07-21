import {Dialog, DialogTitle, DialogContent, TextField, Button} from '@mui/material';
import { useEffect, useState } from 'react';
import { usersRoutes } from '../routes';
import { useAuth } from '../context';

const UserDataEditDialog = ({open, handleClose, userData}) => {
    const {setUserData} = useAuth()
    const [nombre, setNombre] = useState()
    const [apellido, setApellido] = useState()
    const [email, setEmail] = useState()
    const [telefono, setTelefono] = useState()

    useEffect(() => {
        if (userData) {
            console.log(userData)
            setNombre(userData.name)
            setApellido(userData.lastName)
            setEmail((userData.email === 'x@x.xx') ? null : userData.email)
            setTelefono(userData.phone)
        }
    }, [userData])

    const saveUser = async () => {
        if (compareChanges()) {
            const response = await usersRoutes.editUser(
                {
                    name: nombre,
                    lastName: apellido,
                    email: email,
                    phone: telefono
                },
                userData._id
            )
            if (response) {
                console.log(response)
                setUserData(response.data)
                handleClose()
            }
        } else {
            alert('No hay cambios')
        }
    }

    const compareChanges = () => {
        if (userData.name !== nombre) {
            return true
        } else if (userData.lastName !== apellido) {
            return true
        } else if (userData.email !== email) {
            return true
        } else if (userData.phone !== telefono) {
            return true
        } else {
            return false
        }
    }

    return(
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Editar datos usuario</DialogTitle>
            <DialogContent>
                <br />
                <TextField onChange={(e) => {setNombre(e.target.value)}} style={{ marginBottom: 30}} id="outlined-basic" label="Nombre" variant="outlined" value={nombre} />
                <br />
                <TextField onChange={(e) => {setApellido(e.target.value)}} style={{ marginBottom: 30}} id="outlined-basic" label="Apellido" variant="outlined" value={apellido} />
                <br />
                <TextField onChange={(e) => {setEmail(e.target.value)}} style={{ marginBottom: 30}} id="outlined-basic" label="Email" variant="outlined" value={email} />
                <br />
                <TextField onChange={(e) => {setTelefono(e.target.value)}} style={{ marginBottom: 30}} id="outlined-basic" label="Teléfono" variant="outlined" value={telefono} />
                <br />
                <Button style={{background: 'brown', color: 'white', marginBottom: 30}} fullWidth onClick={saveUser}>
                    Guardar
                </Button>
                <Button style={{background: 'red', color: 'white'}} fullWidth onClick={handleClose}>
                    Cancelar
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default UserDataEditDialog