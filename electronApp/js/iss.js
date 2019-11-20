const { BrowserWindow } = require('electron').remote
const {ipcRenderer} =require('electron')
var mysql = require("mysql");

let latitudAlerta=40.46
let longitudAlerta=-3.74
let velocidadAlerta=30000
let sqlInsert


//esperamos un mensaje por el canal respuestaSolicitud e imprimimos el mensaje en el div prueba. Guardamos el mensaje en las variables de control de alertas
ipcRenderer.on('respuestaSolicitud', (event,arg)=>{
  console.log(arg[0])
  document.getElementById('prueba').innerHTML=arg;
  velocidadAlerta=arg[0]
  laongitudAlerta=arg[1]
  latitudAlerta=arg[2]
})

//nos conectamos a la base de datos
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "vn9rn7rz",
    database: "ISS"
});

connection.connect(function (err) {
    if(err){
        console.log("error");
    }else{
        console.log("connected");
    }
});

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



//conectamos con la API
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
  //imprimimros en iss.html los valores recogidos de la api
  document.getElementById('lat').textContent = latitude.toFixed(2);
  document.getElementById('lon').textContent = longitude.toFixed(2);
  document.getElementById('altitude').textContent = altitude.toFixed(2);
  document.getElementById('velocidad').textContent = velocity.toFixed(2);
  document.getElementById('visibilidad').textContent = visibility;

  //notificamos cuando se cumplen las condiciones de la alerta
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


//insertamos valores en la base de datos
  //sqlInsert="INSERT INTO consultaISS (longitud, latitud, velocidad, fecha) VALUES ('3','2','2','2019-11-01')"
  //var sqlInsert = "INSERT INTO `consultaISS` (`longitud`, `latitud`, `velocidad`, `fecha`) VALUES ('" + longitude.toFixed(2) + "', '" + latitude.toFixed(2) + "', '" + velocity.toFixed(2) + "',  'now()')"
  var sqlInsert = "INSERT INTO `consultaISS` (`longitud`, `latitud`, `velocidad`, `fecha`) VALUES ('" + longitude.toFixed(2) + "', '" + latitude.toFixed(2) + "', '" + velocity.toFixed(2) + "',  now())"
//'" + longitude.toFixed(2) + "'
  connection.query(sqlInsert, function (error, result, fields) {

   if (error) console.log(error.code);
   else {
       //console.log(result);
       //$('#resultDiv').text(results[0].emp_name); //emp_name is column name in your database
   }
  });


}

getISS();
setInterval(getISS, 2000);

var sql = "SELECT * FROM consultaISS";
//console.log(sql)

connection.query(sql, function (error, result, fields) {

  //mostramos por consola los resultados de la base de datos
 if (error) console.log(error.code);
 else {
     console.log(result);
     //$('#resultDiv').text(results[0].emp_name); //emp_name is column name in your database
 }
});

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


//abre la ventana de alertas. Se puede llamar a BrowserWindow porque tenemos remote
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
