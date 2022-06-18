import {contHeight} from "./main.js";

class Player {

    constructor(x,y,height,width, color, player_div) {
        this.xCoor = x;
        this.yCoor = y;
        this.pHeight = height;
        this.pWidth = width;
        this.color = color;
        this.jump = false;
        this.slide = false;
        this.stopslide = false;
        this.alreadySlides = false;
        this.jumpVel = 0;
        this.startJumpVel = 0;
        this.falldown = false;
        this.gravity = 0.000045*contHeight;     //TODO muss noch für responsive angepasst werden
        this.jumpBoost = 0;
        this.blocked = false; //so player can walk on objects
        this.anotherjump = false;
        this.blowback = 0;
        this.push = 0;
        this.win = false;
        this.lose = false;
        this.player_div = player_div;
    }
    moveX(deviationX) {
        this.xCoor += deviationX;
    }

    moveY(deviationY) {
        this.yCoor -= deviationY;
    }

    renderPlayer(){
        this.player_div.removeAttribute("style");
        this.player_div.style.cssText =`left: ${this.xCoor}px; top: ${this.yCoor}px; height: ${this.pHeight}px; width: ${this.pWidth}px; background-color: ${this.color}`;
    }

}

function setPlayer(playerHeight, playerWidth, contWidth, contHeight, color, player_div) {
  let xStart = (contWidth / 2 - playerWidth / 2);
  let yStart = (contHeight - playerHeight);
  let player = new Player(xStart, yStart, playerHeight, playerWidth, color, player_div);
  player.renderPlayer();
  return player;
}

export {setPlayer, Player}