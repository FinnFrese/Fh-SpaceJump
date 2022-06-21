const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
      origin: "*",
      credentials: false
    }
  });
const { createGameState, gameLoop } = require('./gamest')
const cors = require("cors");
const { emit } = require("process");
const fs = require('fs');
const path = require('path');

console.log("Server running.");

const state = {};
const clientRooms = {};

io.on('connection', client => {

  let Object_JSON = createLevelJSON();
  client.emit('Levels', Object_JSON);

  client.on('PlInfo', handleInfo);
  client.on('createGame', handleNewGame);
  client.on('joinGame', joinGame);
  client.on('clearGame', clearGame);

  function handleInfo(playerinfo){
    //console.log(playerinfo);
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }
    try{
      playerinfo = JSON.parse(playerinfo);
    }catch(e){
      console.error(e);
      return;
    }
    //console.log(playerinfo);
    if(playerinfo){
      try{
      state[roomName].players[client.number-1].lost = playerinfo["losing"]
      state[roomName].players[client.number-1].won = playerinfo["winning"]
      state[roomName].players[client.number-1].pWidth = playerinfo["pWidth"]
      state[roomName].players[client.number-1].pHeight = playerinfo["pHeight"]
      state[roomName].players[client.number-1].xCord = playerinfo["xCord"]
      state[roomName].players[client.number-1].yCord = playerinfo["yCord"]
      }catch{}
    }
  }

  function createLevelJSON() {
    const jsonsInDir = fs.readdirSync('./Level').filter(file => path.extname(file) === '.json');
    let json = [];
    jsonsInDir.forEach(file => {
      let fileData = fs.readFileSync(path.join('./Level', file));
      fileData = JSON.parse(fileData);
      json.push(fileData);
    });
    return json;
  }

  function handleNewGame() {
    let roomName = makeid(7);
    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName);
    //console.log(clientRooms);
    state[roomName] = createGameState();
    client.join(roomName);
    client.number = 1;
    client.emit('init', 1);
  }

  function joinGame(gameCode) {
    let room;
    try{
    room = io.sockets.adapter.rooms.get(gameCode).size;
    }catch{ room=0}
    if(room===0){
      client.emit('No Room');
      return;
    }else if(room>1){
      client.emit('Room full');
      return;
    } 
    clientRooms[client.id] = gameCode;
    client.join(gameCode);
    client.number = 2;
    client.emit('init', 2);
    startGame(gameCode);
  }

  function clearGame(gameCode){
    try{
    clientRooms[client.id] = null;
    state[gameCode] = null;
    }catch{}
    client.leave(gameCode);
    }
})

function startGame(roomName) {
  const intervallId = setInterval(() => {
    const winner = gameLoop(state[roomName]);
    //console.log('Running')
    if (!winner){
      emitGameState(roomName, state[roomName]);
    }else{
      emitGameOver(roomName, winner);
      state[roomName]=null;
      clearInterval(intervallId)
    }
  }, 1000 / 60);
}

function makeid(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function emitGameState(roomName, state){
io.sockets.in(roomName).emit('gameState', JSON.stringify(state))
}

function emitGameOver(roomName, winner) {
  io.sockets.in(roomName)
  .emit('gameOver', JSON.stringify({winner}))
}

io.listen(process.env.PORT ||8080);