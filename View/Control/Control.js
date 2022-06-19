import {createObjectArray} from "./Objects.js";
import {userInput} from "./UserControl.js";
import {AnimateGame} from "./Animation.js";
import {contHeight, contWidth, socket, player1, level_Object_JSON, playerHeight, playerWidth} from "./main.js";
import {lock, deviceType} from "./Landscape.js";
import { gatherForJson } from "./jsoncontent.js";
import {createp2, player2} from "./Secondplayer.js";
import {mobileUserControl} from "./MobileControls.js";

let mode = null;
let playernumber = null;

let menu = document.getElementById("menu");
let singleButton = document.getElementById("singleplayer");
let multiButton = document.getElementById("multiplayer");
let createButton = document.getElementById("createGame");
let joinButton = document.getElementById("joinGame");
let joinCode = document.getElementById("joinCode");
let scoreButton = document.getElementById("score");
let message = document.getElementById("message");
let playButton = document.getElementById("play");
let backButton = document.getElementById("backToMenu");
let maxLevel = window.localStorage.getItem('maxLevel');
let select = document.getElementById("level");
let levelToPlay = parseInt(maxLevel);
let RoomCode;
let welcome = document.getElementById("welcome-popup");


welcome.classList.add("opacity-0");
setTimeout(()=>menu.classList.add("opacity-1"),2000);

//dropdown menü mit allen Leveln die erreicht wurden.
function updateDropdown() {
    select.querySelectorAll("option").forEach((node) => {
        node.remove();
    })
    for (let i = parseInt(maxLevel); i >= 0; i--) {
        let el = document.createElement("option");
        el.textContent = "Level " + (i + 1);
        el.value = i.toString();
        select.appendChild(el);
    }
}

updateDropdown();

//ausgewähltes level speichern
select.addEventListener('change', function() {
    levelToPlay = parseInt(this.value);
});

singleButton.addEventListener('click', singlePlayerMenu);
scoreButton.addEventListener('click', showScore);
multiButton.addEventListener('click', multiPlayerMenu);
createButton.addEventListener('click', createRoom);
joinButton.addEventListener('click', joinRoom);
playButton.addEventListener('click', play);
backButton.addEventListener('click', backToMenu);


function startSingleGame(level) {
    player1.resetPlayer(playerHeight,playerWidth, contHeight, contWidth);
    menu.style.display = "none";
    //Delete remaining objects from last game to restart game
    let oldObjects = document.getElementsByClassName('object');
    while(oldObjects.length > 0) {
        oldObjects[0].remove();
    }
    let ObjectArray = createObjectArray(level_Object_JSON, level);

    let devicetype = deviceType();
    if(devicetype === "tablet" || devicetype === "mobile") {
        mobileUserControl();
    }
    document.addEventListener("keydown", userInput);
    document.addEventListener("keyup", userInput);

    AnimateGame(ObjectArray, level, player1, 1);
}

function play() {
    menu.style.display = "none";
    if(mode === 1) {
        if(levelToPlay < level_Object_JSON.length) {
            startSingleGame(levelToPlay);
        } else {
            message.innerText = "No Level found!";
            singleButton.style.display = "none";
            multiButton.style.display = "none";
            scoreButton.style.display = "none";
            playButton.style.display = "none";
            backButton.style.display = "block";
            select.style.display = "none";
            createButton.style.display = "none";
            joinButton.style.display = "none";
            joinCode.style.display = "none";
        }
    }
}
function singlePlayerMenu() {
    mode = 1;
    if(maxLevel == '0') {
        message.innerText = "Play the first level!";
    } else {
        message.innerText = "You are at Level " + (parseInt(maxLevel) + 1);
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
    playernumber = 1;
    socket.emit('createGame')
    socket.on('gameCode', codemessage)
    //var gameid = cookiearray("id");
    function codemessage(msg){
        message.innerText = 'Warte auf Spieler 2\nRaumcode: '+msg;
        RoomCode=msg;
    }
    createButton.style.display = "none";
    joinButton.style.display = "none";
    joinCode.style.display = "none";
    backButton.style.display = "block";
    singleButton.style.display = "none";
    multiButton.style.display = "none";
    scoreButton.style.display = "none";
    select.style.display = "none";
    gatherForJson(player1);
    createp2();
}

function joinRoom() {
    playernumber = 2;
    const code = document.getElementById('joinCode');
    gatherForJson(player1);
    createp2();
    RoomCode = code.value;
    socket.emit('joinGame', code.value);
}

function backToMenu() {
    player1.resetPlayer(playerHeight,playerWidth, contHeight, contWidth);
    if(mode === 2) {
        socket.emit('clearGame', RoomCode);
    }
    message.querySelectorAll("p").forEach((p) => {
        p.remove();
    })
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

    let score = JSON.parse(window.localStorage.getItem('scoreBoard'));
    if(score) {
        score.forEach( (s) => {
            let elem = document.createElement("p");
            elem.innerText = s.code + " : " + s.winner;
            message.appendChild(elem);
        })
    } else {
        message.innerText = "No score yet.";
    }
    playButton.style.display = "none";
    backButton.style.display = "block";
    singleButton.style.display = "none";
    multiButton.style.display = "none";
    createButton.style.display = "none";
    joinButton.style.display = "none";
    joinCode.style.display = "none";
    scoreButton.style.display = "none";
    select.style.display = "none";
}

function deleteOldObjs() {
    let oldObjects = document.getElementsByClassName('object');
    while(oldObjects.length > 0) {
        oldObjects[0].remove();
    }
}

function win(level) {
//update localstorage maxlevel

    if(level +1 < level_Object_JSON.length && parseInt(window.localStorage.getItem('maxLevel')) < (level +1)) {
        window.localStorage.setItem('maxLevel', (level + 1));
    }
    maxLevel = window.localStorage.getItem('maxLevel');
    singleButton.style.display = "none";
    playButton.style.display = "block";
    backButton.style.display = "block";
    multiButton.style.display = "none";
    createButton.style.display = "none";
    joinButton.style.display = "none";
    joinCode.style.display = "none";
    scoreButton.style.display = "none";
    if(mode === 1) {
        updateDropdown();
        select.style.display = "block";
    } else {
        select.style.display = "none";
    }
    message.innerText = "You won! You made it to level " + (parseInt(window.localStorage.getItem('maxLevel')) +1);
    deleteOldObjs();
    menu.style.display = 'flex';
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
    deleteOldObjs();
    menu.style.display = 'flex';
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
    let winState;
    winner = JSON.parse(winner);
    if(winner['winner'] == 0) {
        message.innerText = "Game end!\n It's a draw!";
        winState = "Draw."
    } else if(playernumber == winner['winner']){
        message.innerText = "Game end!\n You won!";
        winState = "You won."
    } else {
        message.innerText = "Game end!\n You lost! Your enemy defeated you";
        winState = "Your enemy won."
    }
    let scoreBoard = JSON.parse(window.localStorage.getItem('scoreBoard'));
    scoreBoard.push({
        code: RoomCode,
        winner: winState
    })
    window.localStorage.setItem('scoreBoard', JSON.stringify(scoreBoard));

    player1.resetPlayer(playerHeight,playerWidth,contHeight,contWidth);
    player2.resetPlayer(playerHeight,playerWidth,contHeight,contWidth);
    player2.player_div.style.display = "none";
    deleteOldObjs();
    menu.style.display = 'flex';
}


export{player1, win, lose, winmulti, lock, deviceType, singlePlayerMenu, multiPlayerMenu, menu}