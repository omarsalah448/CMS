const { contextBridge, ipcRenderer } = require('electron');

let api = {
    callApi: async () => {
        var result = await ipcRenderer.invoke("callApi");
        let content = document.getElementById("main-content");
        content.innerHTML = JSON.stringify(result);
    },

    executeCommand: async (command) => {
        await ipcRenderer.send("executeCommand", command);
    },

    registerDevice: async () => {
        let key = await ipcRenderer.invoke("registerDevice");
        let content = document.getElementById("main-content");
        content.innerHTML = "Device Registered Succesfully";
        await api.executeCommand("sudo tailscale up --authkey " + key);
    },

    shareDevice: async () => {
        let response = await ipcRenderer.invoke("shareDevice");
        let content = document.getElementById("main-content");
        content.innerHTML = "Resource Shared Succesfully";
    }
}

contextBridge.exposeInMainWorld("api", api);



let websocketBridge = {
    createConnection: () => {
        console.log("in websocket preload");
        ipcRenderer.send("websocket");
    }
}

contextBridge.exposeInMainWorld("websocketBridge", websocketBridge);