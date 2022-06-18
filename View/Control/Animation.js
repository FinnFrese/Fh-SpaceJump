import {player1, win, lose} from "./Control.js"
import {checkCollision} from "./CollisionDetect.js";
import {userInput, jump, slide, stopSlide} from "./UserControl.js";
import{gatherForJson} from "./jsoncontent.js";
import{ending} from "./Secondplayer.js";
import{contWidth, starsArray} from "./main.js";

function AnimateGame(ObjectArray, level, player, mode) { //level start at 0!
    const movement = contWidth*0.0024;
    let collision = false;
    animationLoop();
    function animationLoop() {
        if(mode===2){
            gatherForJson(player1);
        }

        player.blocked = false;
        collision = false; // to check if any Object in Array collides with player
        //updates the stars in background
        for(let i = 0 ; i < starsArray.length ; i++) {
            let star = starsArray[i];
            if(star.xObj <= 0) {
                star.xObj = contWidth;
            }
            star.moveX(-movement);
            star.renderObject();
        }
        //Updates every Object in Array --> movement to left
        for(let i = 0 ; i < ObjectArray.length ; i++) {
            let Obj = ObjectArray[i];

            if((player.xCoor <= 0) || ending === true) {
                if(mode === 1) {
                    lose();
                } else {
                    player1.lose = true;
                }
                return;
            }

            //checks for a collision
            if(checkCollision(player,Obj, movement)) {
                collision = true; // some object collides
            }

            //Objekt geht aus linkem Bildschirmrand
            if(Obj.xObj <= 0 && Obj.objectExists) {
                //cut off image on the left
                Obj.objectDiv.style.direction = 'rtl';
                if(Obj.objWidth <= 0) {
                    Obj.deleteObject();
                    Obj = null;
                    //if last Object deleted -> end Animation
                    if( i === ObjectArray.length - 1) {
                        if(mode === 1) {
                            win(level);
                        } else {
                            player1.win = true;
                        }
                        return;
                    }
                }
                else {
                    Obj.renderObject();
                    Obj.objWidth -= movement;
                }
                continue; //so the Object is not moved to left anymore
            }
            //Objekt kommt aus rechtem Bildschirmrand
            else if(Obj.xObj <= contWidth) { //Object reaches screen

                Obj.renderObject();

                //to let Objects slide into screen smooth
                if(Obj.objWidth <= Obj.finalWidth) {
                    //cut off image on the right
                    Obj.objectDiv.style.direction = 'ltr';
                    Obj.objWidth += movement;
                }
            }
            Obj.moveX(-movement);
        }
        //after every single obj was updated and checked for collision
        // if collision happened:
        if(collision) {
            removeEventListener("keydown", userInput);
            removeEventListener("keyup", userInput);
        }
        if(!collision) {  //if nowhere was a collision enable user input
            addEventListener("keydown", userInput);
            addEventListener("keyup", userInput);
        }
        player.moveX(player.push);
        player.push -= 0.002*contWidth;
        if(player.push < 0) player.push = 0;

        player.moveX(-player.blowback);
        player.blowback -= 0.002*contWidth; //TODO Wert anpassen
        if(player.blowback < 0) player.blowback = 0;


        //check all userControl events
        if(player.jump && !player.blocked) {
          //player is blocked when collision with object from top
                jump(player);
        }
        if(player.slide) {
            slide(player);
        }
        if(player.blowback === 0 && player.stopslide) { //player can not stand up while blown back
            stopSlide(player);
        }

        player.renderPlayer();

        if(mode !== 2) {
            window.requestAnimationFrame(animationLoop);
        }
    }
}


export{AnimateGame}

