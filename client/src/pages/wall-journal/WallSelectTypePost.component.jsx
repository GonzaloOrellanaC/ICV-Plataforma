import { Grid } from "@mui/material"

const WallSelectTypePost = ({selectTypePost}) => {
    
    return (
        <Grid container style={{height: 'calc(100vh - 250px)', overflowY: 'auto'}}>
            <Grid item xs={12} md={4} style={{padding: 10}}>
                <div className="postExampleContainer" id='only-text' onClick={() => {selectTypePost('only-text')}}>
                    <div className="titleExample"/>
                    <br />
                    <div className="textExample"/>
                    <div className="textExample"/>
                    <div className="textExample"/>
                    <div className="textExample"/>
                    <div className="textExample"/>
                    <div className="textExample"/>
                    <p className="textExampleContainer">Solo Texto</p>
                </div>
            </Grid>
            <Grid item xs={12} md={4} style={{padding: 10}}>
                <div className="postExampleContainer" id='text-photo' onClick={() => {selectTypePost('text-photo')}}>
                    <Grid container>
                        <Grid item sm={6} style={{ paddingRight: 5 }}>
                            {/* <div className="imageExample"/> */}
                            <img src="../assets/no-image-icon-6.png" alt="no-video" width={'100%'} /* height={'100%'} */ />
                        </Grid>
                        <Grid item sm={6} style={{ paddingLeft: 5 }}>
                            <div className="titleExample"/>
                            <br />
                            <div className="textExample"/>
                            <div className="textExample"/>
                            <div className="textExample"/>
                            <div className="textExample"/>
                            <div className="textExample"/>
                        </Grid>
                    </Grid>
                    <p className="textExampleContainer">Imágen y Texto</p>
                </div>
            </Grid>
            <Grid item xs={12} md={4} style={{padding: 10}}>
                <div className="postExampleContainer" id='title-video' onClick={() => {selectTypePost('title-video')}}>
                    <Grid container>
                        <Grid item sm={6} style={{ paddingRight: 5 }}>
                            {/* <div className="videoExample"/> */}
                            <img src="../assets/no-video.png" alt="no-video" width={'100%'} height={'100%'} />
                        </Grid>
                        <Grid item sm={6} style={{ paddingLeft: 5 }}>
                            <div className="titleExample"/>
                            <br />
                            <div className="textExample"/>
                            <div className="textExample"/>
                            <div className="textExample"/>
                            <div className="textExample"/>
                            <div className="textExample"/>
                        </Grid>
                    </Grid>
                    <p className="textExampleContainer">Video y Texto</p>
                </div>
            </Grid>
        </Grid>
    )
}

export default WallSelectTypePost
