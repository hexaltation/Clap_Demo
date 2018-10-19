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
var id;
mySocket.binaryType = "arraybuffer";

mySocket.onopen = function (event) {
    sha256(String(Date.now())+navigator.userAgent).then(pid => {
        let msg = {
            'event':'pid',
            'data':pid,
            }
        mySocket.send(JSON.stringify(msg));
        id = pid;
    });
    console.log("Connected");
};

mySocket.onmessage = function (event) {
    let message = JSON.parse(event.data);
    if (message.event==='blobImage'){
        let blob = message.data.data;
        drawImageBinary(blob);
    }
}

document.addEventListener('clap_change', (evt)=>{
    let msg = {
                'event':'color_info',
                'data':evt.colorLevels,
                'type':'thumb'
                }
    mySocket.send(JSON.stringify(msg));
});

function downloadImage(thing){
    console.log("Download button clicked");
    let url = "http://localhost:3000/img/"+id;
    console.log(url);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
        var blob = xhr.response;
        saveBlob(blob, id+".jpg");
    }
    xhr.send();
}

function saveBlob(blob, fileName) {
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
}

function sendImage(data) {
    let file = data.files[0];
    var url = URL.createObjectURL(file);
    var img = new Image;

    img.onload = function() {
        var canvas = document.getElementById("myCanvas");
        canvas.height=img.height;
        canvas.width=img.width;
    };

    img.src = url;

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
            'colorLevels': slider.colorLevels,
            }
        mySocket.send(JSON.stringify(msg));
    }
}

function drawImageBinary(imgData) {

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    //var uInt8Array = new Uint8Array(imgData);
    var uInt8Array = imgData;
    var i = uInt8Array.length;
    var binaryString = [i];
    while (i--) {
        binaryString[i] = String.fromCharCode(uInt8Array[i]);
    }
    var data = binaryString.join('');

    var base64 = window.btoa(data);

    var img = new Image();
    img.src = "data:image/jpeg;base64," + base64;
    img.onload = function () {
        console.log("Image Onload");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.onerror = function (err) {
        console.log("Img Onerror:", err);
    };

}
