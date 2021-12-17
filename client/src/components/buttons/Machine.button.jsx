import React from 'react'
import PropTypes from 'prop-types'
import { Button, makeStyles } from '@material-ui/core'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'inline-block',
        height: 220,
        width: 220,
        border: '5px solid gray',
        padding: 0,
        backgroundColor: 'rgba(255,255,255,0.5)',
        boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.08)',
        '&:hover': {
            '& .overlay': {
                width: 220,
                height: 220,
                top: -5,
                left: -5,
                position: 'absolute',
                backgroundColor: 'rgba(255,0,0,0.3)',
                borderRadius: 4
            }
        }
    },
    card: {
        boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.08)',
    },
    imageContainer: {
        width: '100%',
        height: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '70%',
        height: 190,
        objectFit: 'cover'
    },
    textContainer: {
        padding: 5,
        //color: theme.palette.primary.main,
        color: '#505050',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'center'
    }
}))

const MachineButton = ({ image, machine, route }) => {
    const classes = useStyles();
    console.log(route);
    console.log(machine);

    return (
        <Button className={classes.root} style={{borderRadius: 20, height: '50%', width: '100%'}} component={Link} to={`/${route}/${JSON.stringify(machine)}`}>
            <div className='overlay'>
                <div>
                    <img className={classes.image} src={image} alt={machine.model}/>
                </div>
                <div /* className={classes.textContainer} */ style={{position: 'absolute', bottom: 5, width: '100%', textAlign: 'center'}}>
                    {`${machine.type} ${machine.brand} ${machine.model}`}
                </div>
            </div>
        </Button>
    )
}

MachineButton.propTypes = {
    variant: PropTypes.oneOf(['Modelo1', 'Modelo2', 'Modelo3'])
}

export default MachineButton
