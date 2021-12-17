/* Material UI */
import { createTheme, makeStyles } from '@material-ui/core'
import { esES } from '@material-ui/core/locale'
import backgroundimg from '../assets/slider_home_01.jpg'

export const theme = createTheme({
    palette: {
        background: {
            default: '#fff'
        },
        primary: {
            light: '#DE0000',
            main: '#920000',
            dark: '#780000'
        }
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                body: {
                    //backgroundImage: `url(${backgroundimg})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPositionX: 'center',
                    backgroundPositionY: 'center',
                    backgroundAttachment: 'fixed',
                    '& ::-webkit-scrollbar': {
                        width: '0.4em'
                    },
                    '& ::-webkit-scrollbar-track': {
                        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                    },
                    '& ::-webkit-scrollbar-thumb': {
                        borderRadius: 10,
                        backgroundColor: 'rgb(160,160,160)'
                    }
                }
            }
        },
        MuiOutlinedInput: {
            root: {
                borderRadius: 20
            },
            input: {
                padding: 10
            }
        },
        MuiInputLabel: {
            outlined: {
                transform: 'translate(14px, 12px) scale(1)'
            }
        },
        MuiButton: {
            root: {
                paddingLeft: 30,
                paddingRight: 30
            }
        },
        MuiListItemIcon: {
            root: {
                justifyContent: 'center'
            }
        }
    }
}, esES)

export const useStylesTheme = makeStyles(theme => ({
    pageRoot: {
        //height: '100%',
        fontFamily:'Raleway'
    },
    pageContainer: {
        //height: '100%',
        //maxHeight: 'calc(100vh - 90px)',
        [theme.breakpoints.down('sm')]: {
            padding: 10
        }
    },
    pageCard: {
        marginLeft: 99,
        //height: '90vh',
        //backgroundColor: 'rgba(255,255,255, 0.8)',
        fontFamily:'Raleway',
        borderRadius: 0,
        boxShadow: 'none',
        padding: 20,
        overflowY: 'auto'
    },
    pageTitle: {
        padding: '40px 0px',
        textAlign: 'center',
        textTransform: 'uppercase',
        // fontWeight: 'bold',
        fontSize: '1.5rem',
        color: theme.palette.primary.main
    },
    backDrop: {
        zIndex: theme.zIndex.drawer - 1,
        marginTop: 90,
        color: '#fff'
    },
    noNavBarMargin: {
        marginLeft: 0
    }
}))

export const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: 20,
    boxShadow: 24,
    p: 4,
};
