const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let window = null

app.commandLine.appendSwitch( "disable-site-isolation-trials" );

app.once('ready', () => {
  window = new BrowserWindow({
    width: 720,
    height: 600,
    show: false
  })

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'editor.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.once('ready-to-show', () => {
    window.show()
  })
})
