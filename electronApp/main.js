//cargamos la Api de electron.js
const electron=require ('electron')
//Cargamos los módulos necesarios de la Api de electron, app, BrowserWindow y Menu
/*
const app=electron.app
const BrowserWindow=electron.BrowserWindow
const Menu=electron.Menu
const shell =require('electron').shell
*/

const { app, BrowserWindow, Menu , shell, dialog, ipcMain,webContents} = electron
const path=require('path')

// Mantén una referencia global del objeto window, si no lo haces, la ventana
// se cerrará automáticamente cuando el objeto JavaScript sea eliminado por el recolector de basura.


/***********************************************
CARGA DE LA VENTANA PRINCIPAL DE LA APLICACIÓN
************************************************/
let win

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
  win.loadFile('./src/index2.html')
  /*
  Se ha encontrado esta forma de cargar los procesos de randerizado pero a nosotros no nos ha funcionado
  const path =require('path')
  const url =require('url')
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

}

// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
// Algunas APIs pueden usarse sólo después de que este evento ocurra.
app.on('ready', function(){

  createWindow()

    const template=[
      {
        label:'Menu',
        submenu:[
          {label:'ISS online',
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
      //Añadimos un nuevo item con un submenú
      {
        label:'info',
        submenu:[
          {label:'Autores',
          click(){


              openWindowAutores()


          }}
        ]
      }

    ]

    const templateDarwin=[
      {
        label:'Menu',
        submenu:[
          {label:'Estacion Espacial Internacional',
            click(){
              openWindowUsers()
            },
            accelerator: 'CmdOrCtrl+Shift+U'

          },
          {label:'Correo Universidad',
            click(){
              shell.openExternal('https://www.uco.es/correo')

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
      //Añadimos un nuevo item con un submenú
      {
        label:'info',
        submenu:[
          {label:'Autores',
          click(){
            openWindowAutores()
          }}
        ]
      }

    ]

    /******************************************************
    EN FUNCIÓN DEL SISTEMA OPERATIVO CARGAMOS UN MENÚ U OTRO
    *******************************************************/
    var menu
    if (process.platform !== 'darwin') {
      menu=Menu.buildFromTemplate(template)
    }

    else {
      menu=Menu.buildFromTemplate(templateDarwin)

    }

    Menu.setApplicationMenu(menu)

})


/***********************************************
CONTROLAMOS EL CIERRE DE LA APLICACIÓN Y DE LAS VENTANAS
************************************************/
app.on('activate', () => {
  // En macOS es común volver a crear una ventana en la aplicación cuando el
  // icono del dock es clicado y no hay otras ventanas abiertas.
  if (win === null) {
    createWindow()
  }
})

// Sal cuando todas las ventanas hayan sido cerradas.
app.on('window-all-closed', () => {
  // En macOS es común para las aplicaciones y sus barras de menú
  // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/***********************************************
CREAMOS OTRA INSTANCIA DE VENTANA(PROCESO DE RENDERIZADO)
PARA ABRIRLA DESDE EL MENÚ DE LA APLICACIÓN
************************************************/


//creamos una nueva instanacia de ventana para abrirla desde nuestro menú de la aplicación
let winIss
function openWindowUsers () {

  winIss = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  winIss.loadFile('./src/iss.html')

  winIss.on('closed', () => {
    winIss = null
  })
}


let inforUser
function openWindowAutores () {

  inforUser = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  })

  inforUser.loadFile('./src/info.html')

  inforUser.on('closed', () => {
    inforUser = null
  })
}

/***********************************************
CREAMOS OTRA INSTANCIA DE VENTANA(PROCESO DE RENDERIZADO)
PARA ABRIRLA DESDE OTRO PROCESO DE RANDERIZADO. HAY QUE EXPORTAR LA FUNCIÓN
************************************************/
//creamos otra instancia de ventana para abrirla desde el proceso de randerizado
exports.openWindow=()=>{
  let newWin =new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      nodeIntegration: true
    }

  })

  newWin.loadFile('./src/iss.html')
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


/***********************************************
PROCESO DE COMUNICACIÓN DEL PROCESO PRINCIPAL
************************************************/
//IPC paso de variables y mensajes
var counter=1;
var recibido;
ipcMain.on('ping', (event, arg)=>{ //se recibe en el arg la variable enviada por renderder a través del canal ping
  recibido=arg;
  //event.sender.send('count', arg+counter);
  //event.sender.send('count', ++count);
  event.sender.send('respuesta', recibido+60 + ' - Soy el Proceso Principal y como respuesta a tu mensaje, te envío hola');
})


//IPC Dialogue

ipcMain.on('open-error-dialog', (event)=>{
  dialog.showErrorBox('an error message', 'demo of an error message')
  event.sender.send('opened-error', 'recibo mensaje y abierto el cuadro de dialogo. todo ok')
})

let datosIssToSend

ipcMain.on('alertaIss', (event, arg)=>{
  datosIssToSend=arg
  dialog.showErrorBox('an error message', arg[0])
  event.sender.send('envioDatosISS', arg[0])// se envía al mismo proceso desde el que se ha recibido el mensaje. El canal está abierto entre esos procesos
  win.webContents.send('envioDatosIssOP', arg[0])

  win.webContents.send('prueba2', 'Velocidad '+ arg[0])//se imprime únicamente en el index2 electronScript2
  win.webContents.send('test', 'testFinal')//prueba canal de comunicación.

  //probar con webContents
  //win.webContents.send('envioDatosISS', arg[0])

})



ipcMain.on('solicitud', (event, arg)=>{
  let optionsDialog={

    type:'warning',
    title:'Información Alerta',
    message:'solicitud Información Alerta',
    buttons: ['aceptar']
  }
  dialog.showMessageBoxSync(optionsDialog)
  //dialog.showErrorBox('an error message', arg)
  event.sender.send('respuestaSolicitud', datosIssToSend)
  win.webContents.send('test', 'testFinal')

})


if(process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, './node_modules', '.bin', 'electron')
  });
}
