import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import './Machine.button.css'


const MachineButton = ({ image, machine, route }) => {
    console.log(route);
    console.log(machine);
    const history = useHistory()
    let newMachine = {
        brand: machine.brand,
        id: machine.id,
        model: machine.model,
        pIDPM: machine.pIDPM,
        type: machine.type,
    }

    return (
        <Button className='buttonContent' style={{borderRadius: 20}} onClick={()=>{history.push(`/${route}/${JSON.stringify(newMachine)}`)}} /* component={Link} to={`/${route}/${JSON.stringify(newMachine)}`} */>
            <img className='imageMachine' src={`data:${machine.image}`} alt={machine.model}/>
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
