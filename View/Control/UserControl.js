import {contHeight, contWidth, playerHeight, playerWidth} from "./main.js";
import {player1} from "./Control.js";

let nowPressed;
let nowReleased;

function userInput(event) {
    player1.startJumpVel = 0.0035*contHeight;
    if(event.type === "keydown"){
    switch(event.keyCode){
        case 32:
            nowPressed = event.timeStamp;
            //set some variables, so loop can react to user input
            if(player1.slide === false && player1.jump === false) {
                player1.jump = true;
                player1.falldown = false;
                player1.jumpVel = player1.startJumpVel;
            }
            else if(player1.jump && player1.blocked) {
                player1.jump = true;
                player1.falldown = false;
                player1.jumpVel = player1.startJumpVel;
                player1.blocked = false; //for jumping while standing on object
                player1.anotherjump = true;
            }
            break;
        case 17:
            if(player1.jump === false) {
                player1.slide = true;
            }
            break;
    }
    }
    else if(event.type === "keyup"){
        switch(event.keyCode){
            case 32:
                nowReleased = event.timeStamp;
                //for a higher jump when key is pressed longer
                if((nowReleased - nowPressed) > 30) {
                    //give jump an extra boost
                }
                break;
            case 17:
            if(player1.jump === false && player1.slide) {
                player1.stopslide = true;
                break;
            }
        }
    }
}
function slide(player) {
        // to not unnecessarily render player multiple times
    if (player.alreadySlides) return;
        //create new Player which overwrites 'standing' player to 'laying' player
        //-->Switch playerWidth and playerHeight to imitate sliding*/
    else {
        player.yCoor = (contHeight - playerWidth);
    }
    player.pWidth = playerHeight;
    player.pHeight = playerWidth;
    player.renderPlayer();
    player.alreadySlides = true;
}

function stopSlide(player){
    player.slide = false;
    player.yCoor = (contHeight - playerHeight);
    player.pWidth = playerWidth;
    player.pHeight = playerHeight;
    player.renderPlayer();
    player.alreadySlides = false;
    player.stopslide = false;
}

function jump(player) {

    let gravity = player.gravity;
    if(player.falldown) {

        if(player.yCoor + player.pHeight >= contHeight - player.startJumpVel) {
            player.yCoor = contHeight - player.pHeight;
            player.jump = false;
            return;
        }
        player.moveY(-player.jumpVel);
        player.jumpVel += gravity;
    }
    else if(player.jumpVel > 0){
        player.moveY(player.jumpVel);
        player.jumpVel -= gravity;
    }
    else if(player.jumpVel <= 0) {
        player.anotherjump = false; //so another jump is possible
        player.falldown = true;
    }
}



export{userInput,jump, slide, stopSlide}