let container = document.getElementsByClassName('colorLevel')[0];
let settings ={
    "width":130,
    "height":130,
    "background":"#BBBBBB",
    "boundary":true,
    "boundaryColor":"#000000",
    "min":0,
    "max":1000
}
var slider = new Clap(container, "demo", settings);
