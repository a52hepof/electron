/*******************
  PRUEBA CANAL DE COMUNICACIÓN
********************/
const {ipcRenderer} =require('electron')

ipcRenderer.on('test', (event,arg)=>{
  console.log(arg)
  document.getElementById('prueba').innerHTML=arg;
})
