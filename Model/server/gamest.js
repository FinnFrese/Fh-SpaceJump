module.exports = {
    createGameState,
    gameLoop,
}
function createGameState() {
return {
    players: [{
        xCord: 0,
        yCord: 0,
        pWidth: 0,
        pHeight: 0,
        lost: false,
        won: false
    },
     {
        xCord: 0,
        yCord: 0,
        pWidth: 0,
        pHeight: 0,
        lost: false,
        won: false
    }]
}
}

function gameLoop(state){
    if(!state){
        return;
    }
    const playerOne = state.players[0];
    const playerTwo = state.players[1];
    /*playerOne.xCord = 0;
    playerOne.yCord = 0;
    playerOne.sliding = false;
    playerOne.stopsliding = false;
    playerOne.lost = false;*/
    if(playerOne.lost || ( playerTwo.won && playerTwo.xCoor > playerOne.xCoor )){
        return 2; //player two wins
    }
    else if(playerTwo.lost || (playerOne.won && playerOne.xCoor > playerTwo.xCoor )){
        return 1; //player one wins
    } else {
        return 0; // unentschieden
    }
}