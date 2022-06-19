import {player1, win, lose} from "./Control.js"
import {checkCollision} from "./CollisionDetect.js";
import {userInput, jump, slide, stopSlide} from "./UserControl.js";
import{gatherForJson} from "./jsoncontent.js";
import{ending} from "./Secondplayer.js";
import{contWidth, starsArray, movement} from "./main.js";
import{Ufo} from "./Objects.js";


function AnimateGame(ObjectArray, level, player, mode) { //level start at 0!
    animationLoop();
    function animationLoop() {
        if(mode===2){
            gatherForJson(player1);
        }

        player.blocked = false;
        player.collision = false; // to check if any Object in Array collides with player
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

            let vel = movement;
            let Obj = ObjectArray[i];

            //so Ufo has double velocity
            if(Obj instanceof Ufo) {
                vel = vel *2;
            }
            if(mode === 1) {
            if(player.xCoor <= 0) {
                    lose();
                    return;
                }
            } else {
                if((player.xCoor <= 0) || ending === true) {
                    player1.lose = true;
                    return;
                }
            }

            //checks for a collision
            checkCollision(player,Obj, vel);


            //Objekt geht aus linkem Bildschirmrand
            if(Obj.xObj <= 0 && Obj.objectExists) {
                //cut off image on the left
                Obj.objectDiv.style.direction = 'rtl';
                if(mode === 2) {
                    Obj.mirrObjDiv.style.direction = 'rtl';
                }
                if(Obj.objWidth <= 0) {

                    Obj.deleteObject();
                    Obj = null;
                    //if last Object deleted -> end Animation
                    //last object cant be an Ufo (bc of double vel)
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
                    if(mode === 2) {
                        Obj.renderMirrObject();
                    }
                    Obj.objWidth -= vel;
                }
                continue; //so the Object is not moved to left anymore
            }
            //Objekt kommt aus rechtem Bildschirmrand
            else if(Obj.xObj <= contWidth) { //Object reaches screen

                Obj.renderObject();
                if(mode === 2) {
                    Obj.renderMirrObject();
                }
                //to let Objects slide into screen smooth
                if(Obj.objWidth <= Obj.finalWidth) {
                    //cut off image on the right
                    Obj.objectDiv.style.direction = 'ltr';
                    if(mode === 2) {
                        Obj.mirrObjDiv.style.direction = 'ltr';
                    }
                    Obj.objWidth += vel;
                }
            }
            Obj.moveX(-vel);
            if(Obj instanceof Ufo) {
                vel = vel /2; //TODO
            }
        }
        //after every single obj was updated and checked for collision
        // if collision happened:
        if(player.collision) {
            removeEventListener("keydown", userInput);
            removeEventListener("keyup", userInput);
        }
        if(!player.collision) {  //if nowhere was a collision enable user input
            addEventListener("keydown", userInput);
            addEventListener("keyup", userInput);
        }

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

        player.moveX(player.push);
        player.push -= player.friction;
        if(player.push < 0) player.push = 0;

        player.moveX(-player.blowback);
        player.blowback -= player.friction;
        if(player.blowback < 0) player.blowback = 0;


        player.renderPlayer();

        if(mode !== 2) {
            window.requestAnimationFrame(animationLoop);
        }
    }
}


export{AnimateGame}

