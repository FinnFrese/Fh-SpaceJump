import {createObjectArray, createStars} from "./Objects.js";
import {setPlayer} from "./Player.js";
import {userInput} from "./UserControl.js";
import {AnimateGame} from "./Animation.js";
import {contHeight, contWidth, socket, player1, level_Object_JSON} from "./main.js";
import {lock, deviceType} from "./Landscape.js";
import { gatherForJson } from "./jsoncontent.js";
import {createp2} from "./Secondplayer.js";

let mode = null;

let menu = document.getElementById("menu");
let singleButton = document.getElementById("singleplayer");
let multiButton = document.getElementById("multiplayer");
let createButton = document.getElementById("createGame");
let joinButton = document.getElementById("joinGame");
let joinCode = document.getElementById("joinCode");
let scoreButton = document.getElementById("score");
let nextButton = document.getElementById("next");
let RoomCode;
let message = document.getElementById("message");
let playButton = document.getElementById("play");
let repeatButton = document.getElementById("repeat");
let backButton = document.getElementById("backToMenu");
let maxLevel = window.localStorage.getItem('maxLevel');
let select = document.getElementById("level");
let levelToPlay = maxLevel;

for(let i = 0; i <= maxLevel; i++) {
    let el = document.createElement("option");
    el.textContent = "Level " + (i+1);
    el.value = i;
    select.appendChild(el);
}

select.addEventListener('change', function() {
    levelToPlay = this.value;
});

singleButton.addEventListener('click', singlePlayerMenu);
scoreButton.addEventListener('click', showScore);
multiButton.addEventListener('click', multiPlayerMenu);
createButton.addEventListener('click', createRoom);
joinButton.addEventListener('click', joinRoom);
playButton.addEventListener('click', play);
backButton.addEventListener('click', backToMenu);

//TODO Drop down menü Level auswahl

function startSingleGame(level) {
    menu.style.display = "none";
    //Delete remaining objects from last game to restart game
    let oldObjects = document.getElementsByClassName('object');
    while(oldObjects.length > 0) {
        oldObjects[0].remove();
    }
    let ObjectArray = createObjectArray(level_Object_JSON, level);

    document.addEventListener("keydown", userInput);
    document.addEventListener("keyup", userInput);

    AnimateGame(ObjectArray, level, player1, 1);
}

function play() {
    menu.style.display = "none";
    if(mode === 1) {
        startSingleGame(levelToPlay);
    }
}
function singlePlayerMenu() {
    mode = 1;
    if(maxLevel == '0') {
        message.innerText = "Play the first level!";
    } else {
        message.innerText = "You are at Level " + (maxLevel + 1);
    }
    singleButton.style.display = "none";
    multiButton.style.display = "none";
    scoreButton.style.display = "none";
    playButton.style.display = "block";
    backButton.style.display = "block";
    select.style.display = "block";
    createButton.style.display = "none";
    joinButton.style.display = "none";
    joinCode.style.display = "none";
}

function multiPlayerMenu() {
    mode = 2;
    message.innerText = '';
    createButton.style.display = "block";
    joinButton.style.display = "block";
    joinCode.style.display = "block";
    backButton.style.display = "block";
    singleButton.style.display = "none";
    multiButton.style.display = "none";
    select.style.display = "none";
}

function createRoom() {
    socket.emit('createGame')
    socket.on('gameCode', codemessage)
    //var gameid = cookiearray("id");
    function codemessage(msg){
        message.innerText = 'Warte auf Spieler 2\nRaumcode: '+msg;
        RoomCode=msg
    }
    createButton.style.display = "none";
    joinButton.style.display = "none";
    joinCode.style.display = "none";
    backButton.style.display = "block";
    singleButton.style.display = "none";
    multiButton.style.display = "none";
    scoreButton.style.display = "block";
    select.style.display = "none";
    gatherForJson(player1);
    createp2();
}

function joinRoom() {
    const code = document.getElementById('joinCode');
    gatherForJson(player1);
    createp2();
    socket.emit('joinGame', code.value);
}

function backToMenu() {
    if(mode === 2) {
        socket.emit('clearGame', RoomCode);
    }
    message.innerText = '';
    playButton.style.display = "none";
    backButton.style.display = "none";
    singleButton.style.display = "block";
    multiButton.style.display = "block";
    createButton.style.display = "none";
    joinButton.style.display = "none";
    joinCode.style.display = "none";
    scoreButton.style.display = "block";
    select.style.display = "none";
}

function showScore() {
    //TODO Score
}

function win(level) {

    if(window.localStorage.getItem('maxLevel') < level +1) {
        window.localStorage.setItem('maxLevel', level + 1);
    }

    singleButton.style.display = "none";
    playButton.style.display = "block";
    backButton.style.display = "block";
    multiButton.style.display = "none";
    createButton.style.display = "none";
    joinButton.style.display = "none";
    joinCode.style.display = "none";
    scoreButton.style.display = "none";
    if(mode === 1) {
        select.style.display = "block";
    } else {
        select.style.display = "none";
    }
    message.innerText = "You won! You made it to level " + (parseInt(window.localStorage.getItem('maxLevel')) +1);
    menu.style.display = 'block';
    player1.win = true;
}



function lose() {
    singleButton.style.display = "none";
    playButton.style.display = "block";
    backButton.style.display = "block";
    multiButton.style.display = "none";
    createButton.style.display = "none";
    joinButton.style.display = "none";
    joinCode.style.display = "none";
    scoreButton.style.display = "none";
    if(mode === 1) {
        select.style.display = "block";
    } else {
        select.style.display = "none";
    }
    message.innerText = "You lost.";
    menu.style.display = 'block';
    player1.lose = true;
}

function winmulti(winner) {
    createButton.style.display = "block";
    joinButton.style.display = "block";
    joinCode.style.display = "block";
    backButton.style.display = "block";
    singleButton.style.display = "none";
    multiButton.style.display = "none";
    scoreButton.style.display = "none";
    select.style.display = "none";
    winner = JSON.parse(winner);
    if(winner['winner'] == 0) {
        message.innerText = "Game end!\n It's a draw!";
    } else {
        message.innerText = "Game end!\n Player " + winner['winner'] + " has won.";
    }
    menu.style.display = 'block';
}


export{player1, win, lose, winmulti, lock, deviceType, singlePlayerMenu, multiPlayerMenu, menu}