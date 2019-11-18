console.log(process.platform + " "+"hola")

const { BrowserWindow } = require('electron').remote

function openISS(){

  let win = new BrowserWindow({ width: 800, height: 600 })
  win.loadFile('./src/iss.html')
  win.on('closed', () => {
    win = null
  })
}

let button = document.createElement('button')

button.textContent='Abrir Ventana'
document.body.appendChild(button)

button.addEventListener('click', ()=>{openISS()})


function openInfo(){

  let win = new BrowserWindow({ width: 1200, height: 900 })
  win.loadFile('./src/info.html')
  win.on('closed', () => {
    win = null
  })
}

let button2 = document.createElement('button')

button2.textContent='Abrir InformaciónUsuarios'
document.body.appendChild(button2)

button2.addEventListener('click', ()=>{openInfo()})
