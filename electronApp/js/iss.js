const { BrowserWindow } = require('electron').remote
const {ipcRenderer} =require('electron')

let latitudAlerta=40.46
let longitudAlerta=-3.74
let velocidadAlerta=30000

  ipcRenderer.on('respuestaSolicitud', (event,arg)=>{
    console.log(arg[0])
    document.getElementById('prueba').innerHTML=arg;
    velocidadAlerta=arg[0]
  })


//https://leafletjs.com/examples/quick-start/
// Making a map and tiles
const mymap = L.map('EstacionInternacional').setView([0, 0], 3);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
accessToken: 'pk.eyJ1IjoiYTUyaGVwb2YiLCJhIjoiY2szNHNxaWFyMDJ0YjNjbzhtd2VpMmxqaCJ9.jD3OtOvidYzFs3g8aihwPg'
}).addTo(mymap);



// Making a marker with a custom icon
const issIcon = L.icon({
  iconUrl: 'iss200.png',
  iconSize: [25, 32],
  iconAnchor: [25, 16]
});
let marker = L.marker([0, 0], { icon: issIcon }).addTo(mymap);


const api_url = 'https://api.wheretheiss.at/v1/satellites/25544';

let firstTime = true;

async function getISS() {
  const response = await fetch(api_url);
  const data = await response.json();
  console.log(data);
  const { latitude, longitude, altitude , velocity, visibility} = data;

  marker.setLatLng([latitude, longitude]);

  if (firstTime) {
    mymap.setView([latitude, longitude], 2);
    firstTime = false;
  }

  document.getElementById('lat').textContent = latitude.toFixed(2);
  document.getElementById('lon').textContent = longitude.toFixed(2);
  document.getElementById('altitude').textContent = altitude.toFixed(2);
  document.getElementById('velocidad').textContent = velocity.toFixed(2);
  document.getElementById('visibilidad').textContent = visibility;




  let condicion=(latitude >latitudAlerta-5 && latitude<latitudAlerta+5)&&(longitude >longitudAlerta-5 && longitude<longitudAlerta+5)
  if(condicion){
    console.log(condicion)
    doNotify2(velocity.toFixed(2), longitude.toFixed(2), latitude.toFixed(2));


  }
  console.log(velocidadAlerta)
  if (velocity> velocidadAlerta) {
    console.log(velocity> velocidadAlerta)
    //document.getElementById('velocidad2').textContent=velocity;
    doNotify(velocity.toFixed(2), longitude.toFixed(2), latitude.toFixed(2));
  }





}

getISS();
setInterval(getISS, 2000);



function doNotify(v, lon, la){

  Notification.requestPermission().then(function(result){
    var myNotification=new Notification('electronNotification',{
      'body':v+"  Km/h  'La velocidad es superior a la indicada'  Longitud: ("+lon+') *** Latitud: ('+la+')'
    })
  })


}


function doNotify2(v, lon, la){

  Notification.requestPermission().then(function(result){
    var myNotification=new Notification('electronNotification',{
      'body':v+"La ISS está cerca de españa: ("+lon+') *** Latitud: ('+la+')'
    })
  })


}



function gestionarAlertas(){

  win = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('./src/alerts.html')

  win.on('closed', () => {

      win = null
  })
  //win.webContents.openDevTools()
  //para cerrar ventana actual después de abrir alerts.html
  var window = remote.getCurrentWindow();
  window.close();


}
