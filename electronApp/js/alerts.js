const {ipcRenderer} =require('electron')
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



console.log(datosIss)
