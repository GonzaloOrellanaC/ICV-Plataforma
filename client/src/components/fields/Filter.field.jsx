import React from 'react'
import { InputAdornment, makeStyles, TextField } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import { useLanguage } from '../../context'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
    root: {
        '& :-webkit-autofill': {
            '-webkit-transition-delay': '9999s',
            '-webkit-transition': 'color 9999s ease-out, background-color 9999s ease-out'
        }
    },
    lightVariant: {
        '& .Mui-focused': {
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white!important'
            }
        },
        '& .MuiInputBase-input': {
            color: 'white'
        }
    },
    darkVariant: {
        '& .Mui-focused .MuiInputAdornment-root': {
            color: theme.palette.primary.main
        }
    }
}))
const FilterField = ({ value, onChange, lightVariant, fullWidth }) => {
    const { dictionary } = useLanguage()
    const classes = useStyles()

    return (
        <TextField
            className={clsx(classes.root, lightVariant ? classes.lightVariant : classes.darkVariant)}
            fullWidth={fullWidth}
            type='text'
            name='filter'
            label={(dictionary.components.fields.filter).toLocaleUpperCase()}
            value={value}
            onChange={onChange}
            variant='outlined'
            InputProps={{
                endAdornment: <InputAdornment position='end'>
                    <FontAwesomeIcon icon={faSearch}/>
                </InputAdornment>
            }}
        />
    )
}

export default FilterField
