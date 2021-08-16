import React from 'react'
import PropTypes from 'prop-types'
import { Button, makeStyles } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faClipboard, faTools, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../../context'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'inline-block',
        textAlign: 'center'
    },
    icon: {
        marginBottom: 15
    },
    button: {
        minWidth: 180
    }
}))

const SectionButton = ({ variant }) => {
    const { dictionary } = useLanguage()

    const classes = useStyles()

    const handleTypeIcon = () => {
        switch (variant) {
        case 'inspection':
            return (<FontAwesomeIcon icon={faClipboard} size='8x'/>)
        case 'maintenance':
            return (<FontAwesomeIcon icon={faTools} size='8x'/>)
        case 'reports':
            return (<FontAwesomeIcon icon={faChartBar} size='8x'/>)
        case 'configuration':
            return (<FontAwesomeIcon icon={faUserCog} size='8x'/>)
        }
    }
    const handleTypeText = () => {
        switch (variant) {
        case 'inspection':
            return dictionary.welcome.inspectionButton
        case 'maintenance':
            return dictionary.welcome.maintenanceButton
        case 'reports':
            return dictionary.welcome.reportsButton
        case 'configuration':
            return dictionary.welcome.configurationButton
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.icon}>
                {handleTypeIcon()}
            </div>
            <div>
                <Button component={Link} to={`/${variant}`} className={classes.button} variant='contained' color='primary'>
                    {handleTypeText()}
                </Button>
            </div>
        </div>
    )
}

SectionButton.propTypes = {
    variant: PropTypes.oneOf(['inspection', 'maintenance', 'reports', 'configuration'])
}

export default SectionButton
