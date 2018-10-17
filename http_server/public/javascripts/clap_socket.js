console.log("Socket connection");
var mySocket = new WebSocket("ws://localhost:8080");
mySocket.binaryType = "arraybuffer";

mySocket.onopen = function (event) {
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

function sendImage() {
    var image = context.getImageData(0, 0, canvas.width, canvas.height);
    var buffer = new ArrayBuffer(image.data.length);
    var bytes = new Uint8Array(buffer);
    for (var i=0; i<bytes.length; i++) {
        bytes[i] = image.data[i];
    }
    mySocket.send(buffer);
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
