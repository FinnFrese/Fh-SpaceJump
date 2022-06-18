import {lock, deviceType} from "./Control.js"
import {createStars} from "./Objects.js";
import { start2Player, endmulti, noRoom } from "./Secondplayer.js";
import { playernumber } from "./jsoncontent.js";
import {setPlayer} from "./Player.js";

const socket = io('https://aqueous-wave-19807.herokuapp.com/');
//global variables
const container = document.getElementById("container");
let contWidth = container.offsetWidth;
let contHeight = container.offsetHeight;

let playerHeight = Math.round(contHeight / 8);
let playerWidth = Math.round(contWidth / 40);
//player created in the center of screen
const player_div = document.getElementById("player");
let player1 = setPlayer(playerHeight, playerWidth, contWidth, contHeight, "white", player_div);

//Json level
let request = new XMLHttpRequest();
request.open("GET", "./Level1.json", false);
request.send(null)
let level_Object_JSON = JSON.parse(request.responseText);

request.open("GET", "./MultiLevel.json", false);
request.send(null)
let multi_level_JSON = JSON.parse(request.responseText);
//console.log(multi_level_JSON)

let starsArray = createStars();

if(window.localStorage.getItem('maxLevel') === null) {
    window.localStorage.setItem('maxLevel', '0');
}

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

export {container, contHeight, contWidth, level_Object_JSON, multi_level_JSON, socket, player1, starsArray, playerHeight, playerWidth};