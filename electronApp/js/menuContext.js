const {remote} = require('electron')
const {Menu, MenuItem} = remote

const menu = new Menu()

// Creamos el menú añadiendo cada item cada vez en lugar de usar plantillas
menu.append(new MenuItem ({
   label: 'Previsión Meterológica',
   click() {
      console.log('item 1 clicked')
   }
}))

menu.append(new MenuItem({type: 'separator'}))
menu.append(new MenuItem({label: 'El tiempo en: ', type: 'checkbox', checked: false}))
menu.append(new MenuItem ({
   label: 'Añadir alerta',
   click() {
      console.log('item 3 clicked')
   }
}))

// Para prevenir el comportamiento normal del botón derecho del ratón
window.addEventListener('contextmenu', (e) => {
   e.preventDefault()
   menu.popup(remote.getCurrentWindow())
}, false)
