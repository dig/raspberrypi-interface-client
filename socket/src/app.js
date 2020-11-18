require('dotenv').config({ path: '../.env' });

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.REACT_APP_SOCKET_PORT });
const { execSync, exec } = require('child_process');

const channelMessageRegex = /^([a-zA-Z0-9]+)((;([a-zA-Z0-9{}():\"\',\.@#-\s]+))+)$/;
const events = {};
let connectionCount = 0;

wss.broadcast = function(message, type = 1) {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN 
        && client.authenticated 
        && client.clientType === type) {
      client.send(message);
    }
  }
};

const formatResponse = (channel, ...data) => `${channel};${data.join(';')}`;

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

let isUpdating = false;
addSocketEvent('update', () => {
  if (!isUpdating) {
    isUpdating = true;
    wss.broadcast(formatResponse('updateState', 0, true));

    const child = execSync('sudo sh ~/interface-client/scripts/install.sh');
    if (child.error) {
      wss.broadcast(formatResponse('updateState', 1, false));
    } else {
      wss.broadcast(formatResponse('updateState', 1, true));
    }
    isUpdating = false;
  } else {
    wss.broadcast(formatResponse('updateState', 0, false));
  }
});

addSocketEvent('shutdown', () => exec('sudo shutdown now'));

const handleSocketMessage = (message, ws) => {
  if (ws.authenticated && ws.clientType === 0) {
    wss.broadcast(message);
  }

  if (message.match(channelMessageRegex)) {
    const args = message.split(';');
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