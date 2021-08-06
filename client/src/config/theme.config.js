/* Material UI */
import { createTheme } from '@material-ui/core'
import { esES } from '@material-ui/core/locale'
import backgroundimg from '../assets/backgroundimg.webp'

const theme = createTheme({
    palette: {
        background: {
            default: '#000'
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
                    backgroundImage: `url(${backgroundimg})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPositionX: 'center',
                    backgroundPositionY: 'center'
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
        MuiButton: {
            root: {
                borderRadius: 20,
                paddingLeft: 30,
                paddingRight: 30
            }
        }
    }
}, esES)

export default theme
