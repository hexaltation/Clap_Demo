console.log("hello world");

const WebSocket = require('ws');
const {processImage, saveImage} = require('./image');

const wss = new WebSocket.Server({ port: 8080 });

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', function connection(ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  console.log("some is connecting");
  ws.on('message', (msg)=>{
      let message = JSON.parse(msg);
      if (message.event === 'color_info'){
        console.log("redinmin",message.data.red.in.min);
        processImage(ws, message.data, message.type)
      }else if (message.event === 'img_blob'){
        console.log(message.data);
        saveImage(message.data);
      }else{
        console.log(msg);
      }
  });
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);
