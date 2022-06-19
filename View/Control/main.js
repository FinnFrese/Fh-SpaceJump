import {lock, deviceType} from "./Control.js"
import {createStars} from "./Objects.js";
import { start2Player, endmulti, noRoom } from "./Secondplayer.js";
import { playernumber } from "./jsoncontent.js";
import {setPlayer} from "./Player.js";

const socket = io('https://spacejump-fh.herokuapp.com/');

//initialisiere localstorage, falls er noch nicht existiert
if(window.localStorage.getItem('maxLevel') === null) {
    window.localStorage.setItem('maxLevel', '0');
}
if(window.localStorage.getItem('scoreBoard') === null) {
    window.localStorage.setItem('scoreBoard', '[]');
}
//global variables
const container = document.getElementById("container");
let contWidth = container.offsetWidth;
let contHeight = container.offsetHeight;
let movement = contWidth*0.0024; //for animation loop and dependencies

let playerHeight = Math.round(contHeight / 10);
let playerWidth = Math.round(contWidth / 50);
//player created in the center of screen
const player_div = document.getElementById("player");
let player1 = setPlayer(playerHeight, playerWidth, contWidth, contHeight, "white", player_div);


let level_Object_JSON = null;

let request = new XMLHttpRequest();
request.open("GET", "./MultiLevel.json", false);
request.send(null)
let multi_level_JSON = JSON.parse(request.responseText);
console.log(multi_level_JSON)

let starsArray = createStars();

if(window.localStorage.getItem('maxLevel') === null) {
    window.localStorage.setItem('maxLevel', '0');
}

socket.on('Levels', (msg) => {level_Object_JSON = msg} )
socket.on('gameState', start2Player);
socket.on('init', playernumber);
socket.on('gameOver', endmulti);
socket.on('No Room', noRoom)

//startGame();

window.onresize = () => location.reload();

// locks hotizontal for tablet or mobile
document.addEventListener("DOMContentLoaded", () => {
    if (deviceType === "mobile" || deviceType === "tablet") {
        lock("landscape-primary");
    }
})

export {container, contHeight, contWidth, level_Object_JSON, multi_level_JSON, socket, player1, starsArray, playerHeight, playerWidth, player_div, movement};