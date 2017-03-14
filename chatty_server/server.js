// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('node-uuid');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

let count = 0;

wss.on('connection', (ws) => {
  console.log('Client connected');
  count++;
  let userCount = {
    type: 'userCountChanged',
    userCount: count
  }
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(userCount));
  });

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'newMessage') {
      // message incoming from client perspective
      let incomingMessage = {
        type: 'incomingMessage',
        id: uuid.v1(),
        username: data.username,
        colorNum: data.colorNum
      };

      let content = [];
      const wordsArray = data.content.split(' ');
      wordsArray.forEach((word) => {
        if (word.match(/\.(jpg|png|gif)\b/)) {
          incomingMessage.image = word;
        } else {
          content.push(word);
        }
      });
      incomingMessage.content = content.join(' ');
      wss.clients.forEach(function each(client) {
        client.send(JSON.stringify(incomingMessage));
      });
    }
    if (data.type === 'postNotification') {
      // notification incoming from client perspective
      const incomingNotification = {
        type: 'incomingNotification',
        id: uuid.v1(),
        content: data.content
      };
      wss.clients.forEach(function each(client) {
        client.send(JSON.stringify(incomingNotification));
      });
    }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    count--;
    userCount = {
      type: 'userCountChanged',
      userCount: count
    }
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(userCount));
    });
  });
});
