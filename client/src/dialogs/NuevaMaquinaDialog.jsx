import { Dialog, Fab } from "@mui/material"
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Grid } from "@mui/material";
import { azureStorageRoutes } from "../routes";

const NuevaMaquinaDialog = ({open, close, isEdit, nuevaMaquina, marcasMaquinas, tipoMaquinas, modelosMaquinas, maquinasTotales}) => {
    const [marca, setMarca] = useState('')
    const [modelo, setModelo] = useState('')
    const [tipo, setTipo] = useState('')
    const [imagen, setImagen] = useState('')
    const [imagenFile, setImagenFile] = useState('')
    const [heightContenedor, setHeightContenedor] = useState(0)
    const [modelosFiltrados, setModelosFiltrados] = useState([])

    useEffect(() => {
        setTimeout(() => {
            const el = document.getElementById('imagenContainer')
        if (el) {
            console.log(el)
            const widthContenedor = el.offsetWidth
            setHeightContenedor(widthContenedor)
            console.log(widthContenedor)    
        }
        }, 100);
    },[])

    useEffect(() => {
        console.log(marca)
        console.log(modelosMaquinas)
        const modelosFiltradosCache = modelosMaquinas.filter((m) => {if (m.marca._id===marca) return m})
        setModelosFiltrados(modelosFiltradosCache)
        setModelo('')
    },[marca])

    const ordenPorMarca = (a, b) => {
        if (a.marca > b.marca) {
            return 1;
          }
          if (a.marca < b.marca) {
            return -1;
          }
          // a must be equal to b
          return 0;
    }

    const ordenPorTipo = (a, b) => {
        if (a.tipo > b.tipo) {
            return 1;
          }
          if (a.tipo < b.tipo) {
            return -1;
          }
          // a must be equal to b
          return 0;
    }

    const ordenPorModelo = (a, b) => {
        if (a.modelo > b.modelo) {
            return 1;
          }
          if (a.modelo < b.modelo) {
            return -1;
          }
          // a must be equal to b
          return 0;
    }

    const buscarImagenMaquina = () => {
        const el = document.getElementById('inputImagenMaquina')
        el.click()
    }

    const imagenSeleccionada = (e) => {
        console.log(e.target.files[0])
        setImagenFile(e.target.files[0])
        const url = URL.createObjectURL(e.target.files[0]);
        const img = new Image;

        img.onload = () => {
            /* URL.revokeObjectURL(img.src); */
            if (img.width > 720 || img.height > 720) {
                alert('Imagen debe ser cuadrada, con máximo de 720 x 720 pixeles')
            } else {
                if ((img.width - img.height) === 0) {
                    setImagen(url)
                } else {
                    alert('Imagen debe ser cuadrada, con máximo de 720 x 720 pixeles')
                }
            }
        };
        img.src = url;
    }

    const guardarMaquina = async () => {
        console.log(tipo, marca, modelo, imagenFile)
        const machine = {
            type:'',
            brand: '',
            model: '',
            typeId: tipo,
            brandId: marca,
            urlImagen: ''
        }
        machine.type = (tipoMaquinas.filter((t) => {if (t._id===tipo) return t})[0]).tipo
        machine.brand = (marcasMaquinas.filter((m) => {if (m._id === marca) return m})[0]).marca
        machine.model = (modelosMaquinas.filter((m) => {if (m._id === modelo) return m})[0]).modelo

        if (imagenFile) {
            const response = await azureStorageRoutes.uploadMachineImage(imagenFile, 'maquinas/imagenes', 'plataforma-mantencion', `${machine.model}.png`)
            /* console.log(response.data.data.url) */
            machine.urlImagen = response.data.data.url
        }
        console.log(machine)
        const res = await nuevaMaquina(machine)
        if (res) {
            close()
        }
    }

    return(
        <Dialog
            open={open}
            maxWidth={'xl'}
            adaptiveHeight={true}
        >
            <div style={{ width: 800, padding: 10}} >
                <h1>{isEdit ? `Edite ` : `Nueva `} máquina</h1>
                <div style={{width: '100%', overflowY: 'auto', height: 'calc(100vh - 300px)'}}>
                    <Grid container>
                        <Grid item xl={8} style={{padding:10}}>
                            <FormControl fullWidth style={{marginBottom: 10}}>
                                <InputLabel>Tipo:</InputLabel>
                                <Select
                                    value={tipo}
                                    onChange={(e)=>{console.log(e.target);setTipo(e.target.value)}}
                                    label="Tipo:"
                                >
                                    <MenuItem style={{fontSize: 15}} value={''}>
                                        Seleccione
                                    </MenuItem>
                                    {
                                        tipoMaquinas.sort(ordenPorTipo).map((t, i) => {
                                            return (
                                                <MenuItem key={i} style={{fontSize: 15}} value={t._id}>
                                                    {t.tipo}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FormControl fullWidth style={{marginBottom: 10}}>
                                <InputLabel>Marcas:</InputLabel>
                                <Select
                                    value={marca}
                                    onChange={(e)=>{setMarca(e.target.value)}}
                                    label="Marcas:"
                                >
                                    <MenuItem style={{fontSize: 15}} value={''}>
                                        Seleccione
                                    </MenuItem>
                                    {
                                        marcasMaquinas.sort(ordenPorMarca).map((m, i) => {
                                            return (
                                                <MenuItem key={i} style={{fontSize: 15}} value={m._id}>
                                                    {m.marca}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FormControl fullWidth style={{marginBottom: 10}}>
                                <InputLabel>Modelos:</InputLabel>
                                <Select
                                    disabled={modelosFiltrados.length === 0}
                                    value={modelo}
                                    onChange={(e)=>{setModelo(e.target.value)}}
                                    label="Modelos:"
                                >
                                    <MenuItem style={{fontSize: 15}} value={''}>
                                        Seleccione
                                    </MenuItem>
                                    {
                                        modelosFiltrados.sort(ordenPorModelo).map((m, i) => {
                                            return (
                                                <MenuItem key={i} style={{fontSize: 15}} value={m._id}>
                                                    {m.modelo}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xl={4} style={{padding:10}}>
                            <button id={'imagenContainer'} onClick={buscarImagenMaquina} style={{width: '100%', height: heightContenedor, border: '1px #ccc solid', borderRadius: 5, position: 'relative'}}>
                                {
                                    imagen.length > 0
                                    ?
                                    <img src={imagen} width={'100%'} />
                                    :
                                    <p style={{color: '#ccc'}}>
                                        Agregar imagen <br /> Max 720p x 720p <br /> Formato PNG
                                    </p>
                                }
                            </button>
                            <input id={'inputImagenMaquina'} style={{display: 'none'}} type="file" accept="image/png" onChange={imagenSeleccionada} />
                        </Grid>
                    </Grid>
                    <Grid container style={{padding:10}}>
                        <Grid item>
                        <button onClick={guardarMaquina}>
                            Guardar
                        </button>
                        </Grid>
                    </Grid>
                </div>
                <Fab onClick={()=>close()} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </div>
        </Dialog>
    )
}

export default NuevaMaquinaDialog