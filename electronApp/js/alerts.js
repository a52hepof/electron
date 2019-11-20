const {ipcRenderer} =require('electron')
const { BrowserWindow } = require('electron').remote
var datosIss
function obtenerDatos(){
    var v = document.getElementById("velocidad").value;
    var lon = document.getElementById("longitud").value;
    var la = document.getElementById("latitud").value;


    datosIss = [v, lon, la];
    console.log(datosIss)
    //return datosIss;
    ipcRenderer.send('alertaIss', datosIss)
}


//console.log(datosIss)

ipcRenderer.on('envioDatosISS', (event,arg)=>{
  document.getElementById('alertas').innerHTML=arg;
  console.log(arg)
})


ipcRenderer.on('prueba2', (event,arg)=>{
  console.log(arg)
  document.getElementById('prueba').innerHTML=arg;
})



 document.getElementById("close-btn").addEventListener("click", function (e) {
      obtenerDatos()
      //no funciona el siguiente método
      var window = remote.getCurrentWindow();
      window.close();

 });
