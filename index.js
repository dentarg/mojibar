var menubar = require('menubar')
var ipc = require('ipc')
var globalShortcut = require('global-shortcut')
var mb = menubar({ dir: __dirname + '/app', width: 400, height: 175, x: 0, y: 0, icon: __dirname + '/app/Icon-Template.png' })
var Menu = require('menu')

// Register a 'ctrl+shift+space' shortcut listener.
mb.app.on('ready', function () {
  var electronScreen = require('screen')
  var bounds = electronScreen.getDisplayNearestPoint(electronScreen.getCursorScreenPoint()).workArea
  bounds.x = 520

  var ret = globalShortcut.register('ctrl+shift+space', function () {
    // It gets angry not knowing where to put the window if bounds not passed
    mb.tray.emit('clicked', null, bounds)
  })

  if (!ret) {
    console.log('registration failed')
  }
})

mb.app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})

// when receive the abort message, close the app
ipc.on('abort', function () {
  mb.emit('hide')
  mb.window.hide()
  mb.emit('after-hide')
})

var template = [
  {
    label: 'Mojibar',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      },
      {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      },
      {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      },
      {
        label: 'Quit App',
        accelerator: 'Command+Q',
        selector: 'terminate:'
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: function () { mb.window.toggleDevTools() }
      }
    ]
  }
]

mb.on('ready', function ready () {
  // Build default menu for text editing and devtools. (gone since electron 0.25.2)
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})

// Make work across workspaces on Mac
mb.on('show', function show () {
  mb.window.setVisibleOnAllWorkspaces(true)
})
