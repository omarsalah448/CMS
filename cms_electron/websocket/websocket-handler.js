// const {WebSocket} = require('ws');

function createSocket() {
    console.log("Creating socket connection...");
    const socket_url = 'ws://100.69.77.69:80/cable';
    const socket = new WebSocket(socket_url);

    socket.onopen = function(event) {
      console.log("Connected to the Rails server.");
      const msg = {
        command: "subscribe",
        identifier: JSON.stringify({
          id: 1,
          channel: 'CommandsChannel'
        })
      };
      socket.send(JSON.stringify(msg));
    };
  
    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);
  
      if (data.type === 'ping') {
        return;
      }
      if (data.message) {
        console.log(data.message);
      }
      console.log("Received data from server", event.data);
    };
  
    socket.onclose = function(event) {
      console.log("Disconnected from the server.");
    };
  
    socket.onerror = function(error) {
      console.log('WebSocket error observed:', error);
    };
  }

  module.exports = { createSocket };