function createConnection() {
    window.websocketBridge.createConnection();
}

let websocketConnectBtn = document.getElementById("websocketConnectBtn");
websocketConnectBtn.addEventListener("click", () => {
    console.log("in websocket connect btn");
    createConnection();
});