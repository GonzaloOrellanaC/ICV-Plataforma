

AFRAME.registerComponent('truck-element', {
    schema: {
      txt: {default:'default'}
    },
    init:  () => {
        document.getElementById('fondo').addEventListener("click", () => {
            console.log('Hello!!!!')
        })
    },
    update: () => {
      
    }
})