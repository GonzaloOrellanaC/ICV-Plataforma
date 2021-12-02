import React from 'react'
import PropTypes from 'prop-types'
import { Button, makeStyles } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faClipboardList, faTools, faUserCog, faUsers } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../../context'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'inline-block',
        textAlign: 'center',
        padding: 10,
        width: '25%',
        //minWidth: 280,
        backgroundColor: 'transparent'
    },
    icon: {
        padding: 20,
        width: '100%',
    },
    button: {
        minWidth: '100%'
    },
    buttonSelection: {
        backgroundColor: '#F9F9F9',
        color: '#505050',
        width: '100%',
        //minWidth: 285,
        minHeight: 340,
        borderRadius: 20,
        fontFamily:'Raleway',
        textTransform: 'none'
    },
    iconButton: {
        color: '#BE2E26',
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
        case 'administration':
            return (<FontAwesomeIcon icon={faUserCog} size='4x' className={classes.iconButton}/>)
        case 'users':
            return (<FontAwesomeIcon icon={faUsers} size='4x' className={classes.iconButton}/>)
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
        case 'administration':
            return dictionary.welcome.administrationButton
        case 'users':
            return dictionary.admin.adminUsersButton
        }
    }

    return (
        <div className={classes.root} component={Link}>
            <Link to={`/${variant}`} style={{textDecoration: 'none'}} className={classes.buttonSelection}>
                <Button variant="contained" className={classes.buttonSelection} >
                    <div className={classes.icon}>
                        {handleTypeIcon()}
                        <br />
                        <p style={{fontSize:'1.5vw', marginBottom: 0, fontWeight: 'bold'}}>{handleTypeText()}</p>
                    </div>
                </Button>
            </Link>
        </div>
    )
}

CardButton.propTypes = {
    variant: PropTypes.oneOf(['inspection', 'maintenance', 'reports', 'configuration', 'administration', 'users'])
}

export default CardButton
