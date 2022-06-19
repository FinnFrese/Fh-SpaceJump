import {contHeight, contWidth, multi_level_JSON, player1} from "./main.js";
import { setPlayer } from "./Player.js";
import { AnimateGame } from "./Animation.js";
import { plnmbr } from "./jsoncontent.js";
import { winmulti, menu} from "./Control.js"
import {createObjectArray} from "./Objects.js";

let p2box = document.getElementById("player2");
let player2;
let playerHeight;
let playerWidth
let ObjectArray = null;

function createp2() {
    playerHeight = Math.round(contHeight / 10);
    playerWidth = Math.round(contWidth / 50);

    //player created in the center of screen
    const player2_div = document.getElementById("player2");
    player2 =  setPlayer(playerHeight, playerWidth, contWidth, contHeight, "grey", player2_div);
    p2box.style.display = 'none';
    //console.log(player2);
    //Objects created
    //console.log(container.classList.contains('object'))

    //Delete remaining objects from last game to restart game
    let oldObjects = document.getElementsByClassName('object');
    while (oldObjects.length > 1) {
        oldObjects[1].remove();
    }
}
function player2update(json, player) {
    let t = JSON.parse(json);
    //console.log(t)
    //    console.log(t)
    //console.log(t['players'][1])
    //console.log("Ende");
    player.xCoor = t['players'][plnmbr]['xCord']*contWidth/100;
    player.yCoor =t['players'][plnmbr]['yCord'];
    if(t['players'][plnmbr]['pHeight'] > t['players'][plnmbr]['pWidth']) {
        player.pHeight = playerHeight;
        player.pWidth = playerWidth;
    } else {
        player.pHeight = playerWidth;
        player.pWidth = playerHeight;
    }
    player.renderPlayer();
}
function start2Player(msg) {
    if(ObjectArray === null) {
        menu.style.display = 'none';
        p2box.style.display = 'block';
        ObjectArray = createObjectArray(multi_level_JSON, 0);
    }
    AnimateGame(ObjectArray, -1, player1,2)
    player2update(msg, player2);
}
let ending = false;
function endmulti(winner){
    ObjectArray = null;
    ending = true
    winmulti(winner);
}


function noRoom(){
    window.alert('No Room');
    p2box.style.display = 'none';
}

export { player2update, createp2, start2Player, endmulti, noRoom, player2, ending }