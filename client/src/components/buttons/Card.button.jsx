import React from 'react'
import PropTypes from 'prop-types'
import { Button, makeStyles, Card, alpha } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faSearch, faClipboard, faClipboardList, faTools, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../../context'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'inline-block',
        textAlign: 'center',
        padding: 10,
        minWidth: 400,
        backgroundColor: 'transparent'
    },
    icon: {
        //marginBottom: 15,
        padding: 20,
        width: '100%',
    },
    button: {
        minWidth: 180
    },
    buttonSelection: {
        //backgroundColor: alpha(theme.palette.primary.main, 1),
        backgroundColor: '#F9F9F9',
        color: '#505050',
        minWidth: 300
    },
    iconButton: {
        color: '#505050',
        //color: '#600000'
    }
}))

const CardButton = ({ variant }) => {
    const { dictionary } = useLanguage()

    const classes = useStyles()

    const handleTypeIcon = () => {
        switch (variant) {
        case 'inspection':
            return (<FontAwesomeIcon icon={faSearch} size='4x' className={classes.iconButton}/>)
        case 'maintenance':
            return (<FontAwesomeIcon icon={faTools} size='4x' className={classes.iconButton}/>)
        case 'reports':
            return (<FontAwesomeIcon icon={faClipboardList} size='4x' className={classes.iconButton}/>)
        case 'configuration':
            return (<FontAwesomeIcon icon={faUserCog} size='4x' className={classes.iconButton}/>)
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
        <div className={classes.root} component={Link}>
            <Link to={`/${variant}`} style={{textDecoration: 'none'}}>
                <Button variant="contained" className={classes.buttonSelection} >
                    <div className={classes.icon}>
                        {handleTypeIcon()}
                        <br />
                        <p style={{fontSize:21, marginBottom: 0}}>{handleTypeText()}</p>
                    </div>
                </Button>
            </Link>
        </div>
        
    )
}

CardButton.propTypes = {
    variant: PropTypes.oneOf(['inspection', 'maintenance', 'reports', 'configuration'])
}

export default CardButton
