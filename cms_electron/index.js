function callApi() {
    window.api.callApi();
}

function executeCommand(command) {
    window.api.executeCommand(command);
}

function registerDevice() {
    window.api.registerDevice();
}

function shareDevice() {
    window.api.shareDevice();
}

let registerDeviceBtn = document.getElementById("registerDeviceBtn");
registerDeviceBtn.addEventListener("click", () => {
    registerDevice();
});

let shareDeviceBtn = document.getElementById("shareDeviceBtn");
shareDeviceBtn.addEventListener("click", () => {
    shareDevice();
});