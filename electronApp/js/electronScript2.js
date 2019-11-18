console.log(process.platform + " "+"hola")

const { BrowserWindow } = require('electron').remote
const {ipcRenderer} =require('electron')

/*

//abrir ventana usando función exportada del proceso principal y remote
const remote = require('electron').remote
//creamos esta variable para comunicarnos con el Proceso Principal
const main = remote.require('./main.js')

let button = document.createElement('button')

button.textContent='Abrir Ventana'
document.body.appendChild(button)

button.addEventListener('click', ()=>{main.openWindow()})
*/



//Abrir ventana ISS usando método BrowserWindow en Randerizado
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



//Abrir ventana Info usando método BrowserWindow en Randerizado
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


//Proceso Ipc de comunicación con el Proceso principal
var a=100;
function clickThing(){
  ipcRenderer.send('ping', a); //enviamos por el canal 'ping' la variable a
}

ipcRenderer.on('count', (event, arg)=>{ //esperamos respuesta y recibimos la variable en arg
  document.getElementById('numberplace').innerHTML=arg;


})


//Dialogue Proceso de randerizado

const errorBtn=document.getElementById('errorBtn')

errorBtn.addEventListener('click', function(){
  ipcRenderer.send('open-error-dialog')

})

ipcRenderer.on('opened-error', (event,arg)=>{
  document.getElementById('mensajeRecibidoError').innerHTML=arg;
  console.log(arg)

})
