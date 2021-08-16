import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core'
// import { useLanguage } from '../../context'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'inline-block',
        height: 220,
        width: 220,
        border: '5px solid gray'
    },
    imageContainer: {
        width: 210,
        height: 160,
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

const MachineButton = ({ image, text }) => {
    // const { dictionary } = useLanguage()
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <div className={classes.imageContainer}>
                <img className={classes.image} src={image} alt={text}/>
            </div>
            <div className={classes.textContainer}>
                {text}
            </div>
        </div>
    )
}

MachineButton.propTypes = {
    variant: PropTypes.oneOf(['Modelo1', 'Modelo2', 'Modelo3'])
}

export default MachineButton
