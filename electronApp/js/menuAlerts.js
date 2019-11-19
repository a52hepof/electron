const {remote} = require('electron')
const {Menu, MenuItem, shell} = remote

const menu = new Menu()

// Creamos el menú añadiendo cada item cada vez en lugar de usar plantillas
menu.append(new MenuItem ({

  label:'Seguimiento ISS externo',
  click(){
      shell.openExternal('http://www.isstracker.com/')

  },
  accelerator: 'CmdOrCtrl+Shift+O'


}))

menu.append(new MenuItem({type: 'separator'}))
menu.append(new MenuItem ({
   label: 'Añadir alerta',

   click(){
     gestionarAlertas()
   }





}))

// Para prevenir el comportamiento normal del botón derecho del ratón
window.addEventListener('contextmenu', (e) => {
   e.preventDefault()
   menu.popup(remote.getCurrentWindow())
}, false)
