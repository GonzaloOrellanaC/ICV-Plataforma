import SignatureCanvas from 'react-signature-canvas'

const Canvas = (props) => {

    const { width, height, setRefCanvas, disabled } = props;

    return (
        <SignatureCanvas 

            ref={(ref) => {setRefCanvas(ref)}}
            penColor='black'
            canvasProps={
                disabled,
                {
                    width: width, 
                    height: height, 
                    style: {
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#333',
                        borderRadius: 20
                    }
                }
            } />
    )
}

export default Canvas