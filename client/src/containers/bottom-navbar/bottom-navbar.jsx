import { Drawer, List, ListItem, ListItemIcon, SwipeableDrawer } from "@mui/material"
import { Fragment } from "react"


const BottomNavbar = ({data}) => {

    const iOS =
            typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    const list = () => {
        {/* <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
                
                <ListItemText primary={text} />
            </ListItem>
            ))}
        </List> */}
    }

    return(
        <div>
            <Fragment>
                <SwipeableDrawer disableBackdropTransition={!iOS} disableDiscovery={iOS} >
                    {list()}
                </SwipeableDrawer>
            </Fragment>
        </div>
    )

}

export default BottomNavbar