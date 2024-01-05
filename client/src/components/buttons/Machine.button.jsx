import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import './Machine.button.css'


const MachineButton = ({ machine, route }) => {
    const navigate = useNavigate()
    let newMachine = {
        brand: machine.brand,
        id: machine.id,
        model: machine.model,
        pIDPM: machine.pIDPM,
        type: machine.type
    }

    return (
        <Button className='buttonContent' style={{borderRadius: 20}} onClick={()=>{navigate(`/${route}/${JSON.stringify(newMachine)}`)}} /* component={Link} to={`/${route}/${JSON.stringify(newMachine)}`} */>
            <img className='imageMachine' src={`data:${machine.image.data}`} alt={machine.model}/>
            <div  style={{position: 'absolute', bottom: 5, width: '100%', textAlign: 'center'}}>
                {`${machine.type} ${machine.brand} ${machine.model}`}
            </div>
        </Button>
    )
}

MachineButton.propTypes = {
    variant: PropTypes.oneOf(['Modelo1', 'Modelo2', 'Modelo3'])
}

export default MachineButton
