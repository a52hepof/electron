
const electron = require('electron')
const Menu=electron.Menu
const app = electron.app
const main = remote.require('./main.js')

var menu =Menu.buildFromTemplate([
  {
    label:'Menu',
    submenu:[
      {label:'Usuarios',
        click(){
          openWindowUsers()
        },
        accelerator: 'CmdOrCtrl+Shift+U'

      },
      {label:'Universidad de Córdoba',
        click(){
          shell.openExternal('https://www.uco.es')

        },
        accelerator: 'CmdOrCtrl+Shift+O'

      },
      {type:'separator'},
      {label:'Exit',
        click(){
          app.quit();
        },
        accelerator: 'CmdOrCtrl+Shift+C'
      }
    ]
  },
  {
    label:'info',
    submenu:[
      {label:'Autores'}
    ]
  }



])

  Menu.setApplicationMenu(menu)
