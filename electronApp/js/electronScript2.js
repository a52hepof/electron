//console.log(process.platform + " "+"hola")

const {ipcRenderer} =require('electron')
//PARA USAR FUNCIONES EXCLUSIVAS DE MAIN.JS USAMOS REMOTE
const { BrowserWindow } = require('electron').remote

/*

/*********************************************************************
abrir ventana usando función exportada del proceso principal y remote
**********************************************************************
const remote = require('electron').remote
//creamos esta variable para comunicarnos con el Proceso Principal
const main = remote.require('./main.js')

let button = document.createElement('button')

button.textContent='Abrir Ventana'
document.body.appendChild(button)

button.addEventListener('click', ()=>{main.openWindow()})
*/




/*********************************************************************
Abrir ventana ISS usando método BrowserWindow en Randerizado.
**********************************************************************/
function openISS(){

  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }

   })
  win.loadFile('./src/iss.html')
  win.on('closed', () => {
    win = null
  })
  //win.webContents.openDevTools()

}


function openTestC(){

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('./src/testC.html')

  win.on('closed', () => {

      win = null
  })
  //win.webContents.openDevTools()



}


/****************************
creamos botón para abrir ventana
***************************/

const content=document.getElementById("contenido2");
let button = document.createElement('button')
button.className='boton_personalizado'
button.setAttribute("id","b1")
button.textContent='ISS'
content.appendChild(button)
button.addEventListener('click', ()=>{openISS()})


/*********************************************************************
Abrir ventana info usando método BrowserWindow en Randerizado.
**********************************************************************/
function openInfo(){

  let win = new BrowserWindow({ width: 1200, height: 900 })
  win.loadFile('./src/info.html')
  win.on('closed', () => {
    win = null
  })
}

/****************************
creamos botón para abrir ventana
***************************/
let button2 = document.createElement('button')
button2.className='boton_personalizado'
button2.setAttribute("id","b2")
button2.textContent='NuestroEquipo'
content.appendChild(button2)
button2.addEventListener('click', ()=>{openInfo()})




//Proceso Ipc de comunicación con el Proceso principal
var a=100;
function clickThing(){
  ipcRenderer.send('ping', a); //enviamos por el canal 'ping' la variable a
}

ipcRenderer.on('respuesta', (event, arg)=>{ //esperamos respuesta y recibimos la variable en arg
  document.getElementById('respuesta').innerHTML=arg;


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


ipcRenderer.on('envioDatosIssOP', (event,arg)=>{
  document.getElementById('alerta').innerHTML=arg;
  console.log(arg)
})



ipcRenderer.on('prueba2', (event,arg)=>{
  console.log(arg)
  document.getElementById('prueba').innerHTML=arg;
})


ipcRenderer.on('test', (event,arg)=>{
  console.log(arg)
  document.getElementById('prueba').innerHTML=arg;
})
