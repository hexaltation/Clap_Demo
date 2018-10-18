const fs = require('fs');

let processImage = (ws, data, type)=>{
    console.log(ws, data, type);
};

let saveImage = (id, data)=>{
    console.log(typeof data);
    let mybyteArray = new Uint8Array(data);
    fs.writeFile('./img/src/'+id, mybyteArray, (err) => {
        if (err) throw err;
        console.log('The file '+id+' has been saved!');
    });
};

let cleanImages = (id)=>{
    let locations = ['./img/src/'+id, './img/render/'+id];

    for (let location of locations){
        fs.unlink(location, (err) => {
            if (err) throw err;
            console.log(location + ' was deleted');
        });
    }
};

module.exports = {
    "processImage":processImage,
    "saveImage":saveImage,
    "cleanImages":cleanImages
}