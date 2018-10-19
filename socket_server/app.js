console.log("hello world");

const WebSocket = require('ws');
const {readImage, saveImage, cleanImages} = require('./image');
const {ffspawn} = require('./ffspawn');

const wss = new WebSocket.Server({ port: 8080 });

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', function connection(ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  console.log("some is connecting");
  ws.on('message', async (msg)=>{
        try {
            let message = JSON.parse(msg);
            let data;
        
            if (message.event === "pid"){
                ws.id = message.data;
            }else if (message.event === 'color_info'){
                await ffspawn(ws.id, message.data);
                data = await readImage(ws.id);
                sendImage(ws, data);
            }else if (message.event === 'img_blob'){
                await saveImage(ws.id, message.data);
                await ffspawn(ws.id, message.colorLevels);
                data = await readImage(ws.id);
                sendImage(ws, data);
            }else{
                console.log(msg);
            }
        }catch(e){
            console.log(e);
        }
    });
});

const sendImage = (ws, data)=>{
    let msg = {
        'event':'blobImage',
        'data':data,
        }
    ws.send(JSON.stringify(msg));
};

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
        cleanImages(ws.id);
        return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);
