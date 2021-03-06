// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path';
import url from 'url';
import { app, Menu, ipcMain } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';

// global references
let mainWindow;

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

const setApplicationMenu = () => {
  const menus = [editMenuTemplate];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath} (${env.name})`);
}

app.on('ready', () => {
  setApplicationMenu();

  mainWindow = createWindow('main', {
    width: 1000,
    height: 800,
    resizable: false
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'main.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // don't open dev tools just now
  /*
  if (env.name === 'development') {
    mainWindow.openDevTools();
  }
  */
});

app.on('window-all-closed', () => {
  app.quit();
});


// define inter process communication events (IPC)
ipcMain.on('post-it', function () {
  if (mainWindow !== undefined) {
    // TODO
    mainWindow.webContents.executeJavaScript("alert('Post it!');");
    /*
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'main-stats.html'),
      protocol: 'file:',
      slashes: true,
    }));
    */
  }
});
