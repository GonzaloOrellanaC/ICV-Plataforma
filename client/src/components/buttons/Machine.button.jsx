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
    imageContainer: {
        width: 210,
        height: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%'
    },
    textContainer: {
        padding: 5,
        color: theme.palette.primary.main,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    }
}))

const MachineButton = ({ image, text, route }) => {
    const classes = useStyles()

    return (
        <Button className={classes.root} component={Link} to={`/${route}/machinecode`}>
            <div className='overlay'></div>
            <div className={classes.imageContainer}>
                <img className={classes.image} src={image} alt={text}/>
            </div>
            <div className={classes.textContainer}>
                {text}
            </div>
        </Button>
    )
}

MachineButton.propTypes = {
    variant: PropTypes.oneOf(['Modelo1', 'Modelo2', 'Modelo3'])
}

export default MachineButton
