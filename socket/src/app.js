const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 51146 });

const channelMessageRegex = /^([a-zA-Z0-9]+)((:([a-zA-Z0-9]+))+)$/;
const events = {};

const addSocketEvent = (channel, func) => {
  const attached = [];
  if (events[channel]) {
    attached = events[channel];
  }

  attached.push(func);
  events[channel] = attached;
};

addSocketEvent('authenticate', (socket, value, type) => {
  console.log(`authenticate = ${value} ${type}`);
});

const handleSocketMessage = (message, ws) => {
  if (message.length <= 500 && message.match(channelMessageRegex)) {
    const args = message.split(':');
    const channel = args[0];
    args.shift();

    if (events[channel]) {
      for (const callback of events[channel]) {
        callback(ws, ...args);
      }
    }
  }
};

const handleSocketConnection = (ws) => {
  ws.on('message', message => handleSocketMessage(message, ws));
};

wss.on('connection', handleSocketConnection);