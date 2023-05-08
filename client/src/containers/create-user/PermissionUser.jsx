import { useEffect, useContext, useState } from "react";
import { Grid } from "@material-ui/core";
import { sitesRoutes } from "../../routes";
import { changeTypeUser } from '../../config'
import { CreateUserContext, useSitesContext } from "../../context";

const PermissionUser = ({width, height, typeDisplay, id}) => {

    const {userData, setUserData} = useContext(CreateUserContext)
    const {siteSelected} = useSitesContext()
    const [siteName, setSiteName] = useState('')

    useEffect(() => {
        console.log(userData)
        if (userData.obras) {
            getSiteName()
        }
    }, [userData.obras])

    const getSiteName = async () => {
        const userDataCache = userData
        let id = ''
        if (userDataCache.obras[0]._id) {
            id = userDataCache.obras[0]._id
        } else {
            id = userDataCache.obras[0]
        }
        const response = await sitesRoutes.getSiteById(id)
        console.log(response)
        setSiteName(response.data.data.descripcion)
    }

    return (
            <Grid container style={{height: height}}>
                <Grid item xl={12} md={12} style={{ padding: 20, marginRight: 0, backgroundColor: '#F9F9F9', borderRadius: 20, overflowY: 'auto'}}>
                    <div style={{textAlign: 'center'}}>
                        <h2>Resumen del usuario</h2>

                        <div style={{width: '100%', marginBottom: 15}}>
                            <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>RUT</p>
                            <p style={{margin: 0, fontSize: 16}}>{userData.rut}</p>
                        </div>

                        <div style={{width: '100%', marginBottom: 15}}>
                            <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Nombre y Apellido</p>
                            <p style={{margin: 0, fontSize: 16}}>{userData.name} {userData.lastName}</p>
                        </div>

                        <div style={{width: '100%', marginBottom: 15}}>
                            <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Tipo de usuario</p>
                            {
                                userData.roles.map((el, i) => {
                                    return (
                                        <p key={i}>{changeTypeUser(el)}</p>
                                    )
                                })
                            }
                        </div>

                        <div style={{width: '100%', marginBottom: 15}}>
                            <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Obra</p>
                            <p style={{margin: 0, fontSize: 16}}>{siteName}</p>
                        </div>

                        <div style={{width: '100%', marginBottom: 15}}>
                            <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Correo electrónico</p>
                            <p style={{margin: 0, fontSize: 16}}>{userData.email}</p>
                        </div>

                        <div style={{width: '100%', marginBottom: 15}}>
                            <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Teléfono</p>
                            <p style={{margin: 0, fontSize: 16}}>+56 {userData.phone}</p>
                        </div>

                        { (typeDisplay === 'Nuevo usuario') && <div style={{width: '100%', marginBottom: 15}}>
                            <p style={{margin: 0, fontSize: 12, fontWeight: 'bold'}}>Contraseña</p>
                            <p style={{margin: 0, fontSize: 16}}>{userData.password} {/* <IconButton style={{fontSize: 16, padding: 2}}><FontAwesomeIcon icon={faEyeSlash} /></IconButton> */} </p>
                        </div>}
                    </div>
                </Grid>
            </Grid>
    )
}

export default PermissionUser