const electron=require ('electron')
const { app, BrowserWindow, Menu } = electron
// Mantén una referencia global del objeto window, si no lo haces, la ventana
// se cerrará automáticamente cuando el objeto JavaScript sea eliminado por el recolector de basura.
const path =require('path')
const url =require('url')

const shell =require('electron').shell


let win
let winUsuarios

function createWindow () {
  // Crea la ventana del navegador.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // y carga el index.html de la aplicación.
  win.loadFile('./src/index.html')
  /*
  win.loadUrl(url.format({
    pathname:path.join(__dirname,'index.html'),
    protocol:'file',
    slashes:true
  }))
  */
  // Abre las herramientas de desarrollo (DevTools).
  win.webContents.openDevTools()

  // Emitido cuando la ventana es cerrada.
  win.on('closed', () => {
    // Elimina la referencia al objeto window, normalmente  guardarías las ventanas
    // en un vector si tu aplicación soporta múltiples ventanas, este es el momento
    // en el que deberías borrar el elemento correspondiente.
    win = null
  })

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

}

function openWindowUsers () {

  winUsuarios = new BrowserWindow({
    width: 600,
    height: 300,
    webPreferences: {
      nodeIntegration: true
    }
  })

  winUsuarios.loadFile('./src/usuarios.html')

  winUsuarios.on('closed', () => {
    winUsuarios = null
  })

}


exports.openWindow=()=>{
  let newWin =new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      nodeIntegration: true
    }

  })

  newWin.loadFile('./src/usuarios.html')
  /*Con el siguiente código cogido de un ejemplo en youtube da error
  newWin.loadUrl(url.format({
    pathname: path.join(__dirname, 'usuarios.html'),
    protocol:'file'
    slashes:'true'
  }))
  */
  newWin.on('closed', () => {
    // Elimina la referencia al objeto window, normalmente  guardarías las ventanas
    // en un vector si tu aplicación soporta múltiples ventanas, este es el momento
    // en el que deberías borrar el elemento correspondiente.
    win = null
  })

}

// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
// Algunas APIs pueden usarse sólo después de que este evento ocurra.
app.on('ready', createWindow)

// Sal cuando todas las ventanas hayan sido cerradas.
app.on('window-all-closed', () => {
  // En macOS es común para las aplicaciones y sus barras de menú
  // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // En macOS es común volver a crear una ventana en la aplicación cuando el
  // icono del dock es clicado y no hay otras ventanas abiertas.
  if (win === null) {
    createWindow()
  }
})

// En este archivo puedes incluir el resto del código del proceso principal de
// tu aplicación. También puedes ponerlos en archivos separados y requerirlos aquí.
