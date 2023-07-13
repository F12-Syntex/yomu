import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

// const reactDevToolsPath = path.join(
//   os.homedir(),
//   'AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\cjpalhdlnbpafiamejdnhcphjbkeiagm\\1.50.0_0'
// )

//load the background script
import { spawn } from 'child_process'

// Spawn a new child process to run the Node.js script
const childProcess = spawn('node', ['electron/backend.js'])

// Listen for output from the child process
childProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})

childProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`)
})

// Listen for the child process to exit
childProcess.on('close', (code) => {
  console.log(`child process exited with code ${code}`)
})

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    width: 1500,
    height: 1050,
    frame: true, // Remove default OS window frame
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    }
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  ipcMain.on('handleClose', () => {
    win?.close()
  })

  ipcMain.on('handleMaximize', () => {
    if (win?.isMaximized()) {
      win?.unmaximize()
    } else {
      win?.maximize()
    }
  })

  ipcMain.on('handleMinimize', () => {
    win?.minimize()
  })
}

export function openWindow(url: string) {
  // Create a new browser window
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true

      // Enable loading of chrome extensions
      //allowRunningInsecureContent: true,
      //webSecurity: false,
    }
  })

  // Load the specified URL in the new window
  win.loadURL(url)

  //load the extension
  win.setMenu(null)

  win.webContents.on('will-redirect', (event) => {
    event.preventDefault()
  })

  // Prevent popups
  win.webContents.on('will-navigate', (event, url) => {
    if (url !== win.webContents.getURL()) {
      event.preventDefault()
    }
  })

  // Show the new window when it's ready to be displayed
  win.once('ready-to-show', () => {
    //win.webContents.session.loadExtension("C:\\Users\\synte\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\gighmmpiobklfepjocnamgkkbiglidom\\5.7.0_0");
    //win.show();
  })
}

app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(async () => {
  createWindow()
  //openWindow("https://animeflix.live/watch/one-piece-episode-1065/");

  //const client_id = "13194";
  //const redirect_uri = "http://localhost:3023/callback";

  //const uri = `https://anilist.co/api/v2/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
  //shell.openExternal(uri)
})
