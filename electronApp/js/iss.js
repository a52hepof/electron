

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
  document.getElementById('velocidad').textContent = velocity;
  document.getElementById('visibilidad').textContent = visibility;

  if (velocity> 27557.60) {
    document.getElementById('velocidad2').textContent=velocity;
    doNotify();
  }
}

getISS();
setInterval(getISS, 2000);

function doNotify(){

  Notification.requestPermission().then(function(result){
    var myNotification=new Notification('electronNotification',{
      'body':'La velocidad es superior a la indicada'
    })


  })

}
