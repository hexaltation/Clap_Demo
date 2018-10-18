console.log("Socket connection");

async function sha256(message) {

    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
}

var mySocket = new WebSocket("ws://localhost:8080");
mySocket.binaryType = "arraybuffer";

mySocket.onopen = function (event) {
    sha256(String(Date.now())+navigator.userAgent).then(pid => {
        let msg = {
            'event':'pid',
            'data':pid,
            }
        mySocket.send(JSON.stringify(msg));
    });
    console.log("Connected");
};

mySocket.onmessage = function (event) {
    let message = JSON.parse(event)
    if (message.event==='blobImage'){
        drawImageBinary(blob);
    }
    console.log(event.data);
}

document.addEventListener('clap_change', (evt)=>{
    let msg = {
                'event':'color_info',
                'data':evt.colorLevels,
                'type':'thumb'
                }
    mySocket.send(JSON.stringify(msg));
    console.log(evt.colorLevels);
});

function downloadImage(thing){
    let msg = {
                'event':'color_info',
                'data':slider.colorLevels,
                'type':'full'
                }
    mySocket.send(JSON.stringify(msg));
    console.log("Submit button clicked");
}

function sendImage(data) {
    let file = data.files[0];
    console.log(file);

    var reader = new FileReader();
    var fileByteArray = [];
    reader.readAsArrayBuffer(file);
    reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
        var arrayBuffer = evt.target.result,
            array = new Uint8Array(arrayBuffer);
        for (var i = 0; i < array.length; i++) {
            fileByteArray.push(array[i]);
            }
        }
        let msg = {
            'event':'img_blob',
            'data':fileByteArray,
            }
            mySocket.send(JSON.stringify(msg));
            console.log(msg);
    }
}

function drawImageBinary(blob) {
    var bytes = new Uint8Array(blob);

    var imageData = context.createImageData(canvas.width, canvas.height);

    for (var i=8; i<imageData.data.length; i++) {
        imageData.data[i] = bytes[i];
    }
    context.putImageData(imageData, 0, 0);

    var img = document.createElement('img');
    img.height = canvas.height;
    img.width = canvas.width;
    img.src = canvas.toDataURL();
}
