const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
const { exec } = require('child_process');
const websocketHandler = require('./websocket/websocket-handler');

app.disableHardwareAcceleration();

var win;

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "./preload.js")
          },
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle("callApi", async() => {
    const response = await axios.get("http://cms-rails/networks");
    return response.data;
});

ipcMain.on("executeCommand", (event, command) => {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
});

ipcMain.handle("registerDevice", async() => {
    const response = await axios.post("http://localhost:3000/tailscale/create_key");
    console.log(response.data);
    return response.data;
});

async function shareDeviceRequest() {
    const options = {
      method: 'POST',
      url: 'http://localhost:3000/tailscale/share_device',
      data: {device_id: '2960068526079515'}
    };
    
    try {
        const { data } = await axios.request(options);
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

// commented code bec we moved that logic to server side

// async function acceptShareDeviceRequest(invitation_url) {
//     const options = {
//         method: 'POST',
//         url: 'https://api.tailscale.com/api/v2/device-invites/-/accept',
//         headers: {Authorization: 'Bearer tskey-api-kLxD11sXH311CNTRL-LyqPCXc2Khg66ohKHCK6hgv4i6FESNEx'},
//         data: {invite: invitation_url}
//     };
    
//     try {
//         const { data } = await axios.request(options);
//         console.log(data);
//         return data
//     } catch (error) {
//         console.error(error);
//     }
// }

ipcMain.handle("shareDevice", async() => {
    // const invitation_url = await shareDeviceRequest();
    // const response = await acceptShareDeviceRequest(invitation_url);
    return await shareDeviceRequest();
});

ipcMain.on("websocket", () => {
    console.log("in websocket main before function call");
    websocketHandler.createSocket();
    console.log("in websocket main after function call");
});