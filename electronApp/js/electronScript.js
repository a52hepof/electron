console.log(process.platform + " "+"hola")
//cargamos el módulo remote
const remote = require('electron').remote
//creamos esta variable para comunicarnos con el Proceso Principal
const main = remote.require('./main.js')

let button = document.createElement('button')

button.textContent='Abrir Ventana'
document.body.appendChild(button)

button.addEventListener('click', ()=>{main.openWindow()})
