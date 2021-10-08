import React, { } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { Divider, Drawer, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core'
import { PlayArrow } from '@material-ui/icons'

import clsx from 'clsx'

//import logo from '../../assets/logo.webp'
import logo from '../../assets/logo_icv.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle as farUserCircle } from '@fortawesome/free-regular-svg-icons'
import { faClipboard, faCog, faHome, faInfoCircle, faSignOutAlt, faUsers } from '@fortawesome/free-solid-svg-icons'
import { useAuth, useNavigation } from '../../context'
import { FilterField } from '../../components/fields'
import { authRoutes } from '../../routes'

const useStyles = makeStyles(theme => ({
    drawer: {
        width: 350,
        flexShrink: 0,
        whiteSpace: 'nowrap'
    },
    drawerOpen: {
        width: 350,
        maxWidth: '100vw',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        overflow: 'hidden'
    },
    drawerClose: {
        width: 48,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: ' hidden'
    },
    drawerPaper: {
        marginTop: 90,
        backgroundColor: 'rgb(127, 127, 127)',
        border: 'none'
    },
    drawerContainer: {
        height: 'calc(100vh - 90px)',
        position: 'relative'
    },
    drawerBottom: {
        position: 'absolute',
        backgroundColor: 'rgb(228, 228, 228)',
        minHeight: 70,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        bottom: 0,
        padding: 5
    },
    bottomButtons: {
        height: 54,
        width: 54
    },
    divider: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.18)'
    },
    searchField: {
        '& .MuiFormLabel-root': {
            color: 'white'
        },
        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white!important'
        },
        '& .fa-search': {
            color: 'white'
        },
        '& .MuiInputBase-input': {
            color: 'white'
        }
    },
    listItemText: {
        whiteSpace: 'normal',
        color: 'white',
        fontWeight: 'bold'
    }
}))
const Navbar = () => {
    const classes = useStyles()
    const { navBarOpen, handleNavBar } = useNavigation()
    const { userData } = useAuth();

    const logout = async () => {
        window.localStorage.setItem('isauthenticated', false);
        window.location.reload();
    }

    return (
        <Drawer
            className={clsx(clsx(classes.drawer, {
                [classes.drawerOpen]: navBarOpen,
                [classes.drawerClose]: !navBarOpen
            }))}
            variant='permanent'
            classes={{
                paper: clsx(classes.drawerPaper, {
                    [classes.drawerOpen]: navBarOpen,
                    [classes.drawerClose]: !navBarOpen
                })
            }}
        >
            <div className={classes.drawerContainer}>
                <Grid container spacing={2} style={{ padding: navBarOpen ? 8 : '8px 0 0 0' }}>
                    <Grid item xs={12} container justifyContent='flex-end'>
                        <IconButton onClick={handleNavBar} style={{ color: 'white' }}>
                            {navBarOpen ? <PlayArrow style={{ transform: 'scaleX(-1)' }}/> : <PlayArrow />}
                        </IconButton>
                    </Grid>
                    {
                        navBarOpen &&
                        (
                            <div style={{ overflowY: 'auto', width: '100%', maxHeight: 'calc(100vh - 224px)' }}>
                                <Grid item xs={12} container justifyContent='center'>
                                    <Link to='/'>
                                        <img src={logo} width='100%' style={{ maxWidth: 200 }}/>
                                    </Link>
                                </Grid>
                                <Grid item xs={12}>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <FontAwesomeIcon icon={farUserCircle} size='2x'/>
                                            </ListItemIcon>
                                            <ListItemText className={classes.listItemText} primary={userData?.fullName} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <FontAwesomeIcon icon={faUsers} size='2x'/>
                                            </ListItemIcon>
                                            <ListItemText className={classes.listItemText} primary={userData?.email} />
                                        </ListItem>
                                        <ListItem>
                                            <Divider className={classes.divider} light/>
                                        </ListItem>
                                        <ListItem>
                                            {/* <TextField
                                                className={classes.searchField}
                                                type='text'
                                                name='searchFilter'
                                                label={'Change for dictionary'}
                                                variant='outlined'
                                                fullWidth
                                                InputProps={{
                                                    endAdornment: <InputAdornment position='end'>
                                                        <FontAwesomeIcon icon={faSearch}/>
                                                    </InputAdornment>
                                                }}
                                            /> */}
                                            <FilterField lightVariant fullWidth/>
                                        </ListItem>
                                    </List>
                                </Grid>
                            </div>
                        )
                    }
                </Grid>
                <div className={classes.drawerBottom}>
                    {
                        navBarOpen &&
                        <Grid container justifyContent='center' alignItems='center' spacing={1}>
                            <Grid item>
                                <IconButton component={Link} to='/' onClick={handleNavBar} className={classes.bottomButtons}>
                                    <FontAwesomeIcon icon={faHome}/>
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <IconButton className={classes.bottomButtons}>
                                    <FontAwesomeIcon icon={faClipboard}/>
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <IconButton className={classes.bottomButtons}>
                                    <FontAwesomeIcon icon={faCog}/>
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <IconButton className={classes.bottomButtons}>
                                    <FontAwesomeIcon icon={faInfoCircle}/>
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={logout} className={classes.bottomButtons}>
                                    <FontAwesomeIcon icon={faSignOutAlt}/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    }
                </div>
            </div>
        </Drawer>
    )
}

export default Navbar
