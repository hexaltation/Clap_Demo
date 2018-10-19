const fs = require('fs');

let readImage = (id)=>{
    return new Promise ((resolve, reject)=>{
        fs.readFile('./img/render/'+id+'.jpg', (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

let saveImage = (id, data)=>{
    return new Promise ((resolve, reject)=>{
        let mybyteArray = new Uint8Array(data);
        fs.writeFile('./img/src/'+id, mybyteArray, (err) => {
            if (err) reject(err);
            console.log('The file '+id+' has been saved!');
            resolve(id);
        });
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
    "readImage":readImage,
    "saveImage":saveImage,
    "cleanImages":cleanImages
}