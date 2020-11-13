require('dotenv').config({ path: '../.env' });

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.REACT_APP_SOCKET_PORT });

const channelMessageRegex = /^([a-zA-Z0-9]+)((:([a-zA-Z0-9]+))+)$/;
const events = {};
let connectionCount = 0;

wss.broadcast = function(message, type = 1) {
  for (const client of wss.clients) {
    if (client.authenticated && client.clientType === type) {
      client.send(message);
    }
  }
};

const addSocketEvent = (channel, func) => {
  const attached = [];
  if (events[channel]) {
    attached = events[channel];
  }

  attached.push(func);
  events[channel] = attached;
};

addSocketEvent('authenticate', (socket, value, type) => {
  if (value === process.env.REACT_APP_SOCKET_AUTH_KEY) {
    socket.authenticated = true;
    socket.clientType = Number(type);
  }
});

const handleSocketMessage = (message, ws) => {
  if (ws.authenticated && ws.clientType === 0) {
    wss.broadcast(message);
  }

  if (message.length <= 500 && message.match(channelMessageRegex)) {
    const args = message.split(':');
    const channel = args[0];
    args.shift();

    if (events[channel] && (ws.authenticated || channel === 'authenticate')) {
      for (const callback of events[channel]) {
        callback(ws, ...args);
      }
    }
  }
};

const handleSocketConnection = (ws) => {
  ws.id = connectionCount++;
  ws.on('message', message => handleSocketMessage(message, ws));
};

wss.on('connection', handleSocketConnection);