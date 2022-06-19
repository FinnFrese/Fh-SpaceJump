import{Ufo,SlideObject,JumpObject, ExtraSpeed} from "./Objects.js";

function checkCollision(player, object, vel) {

    //should maybe change the 4
    //stop any blowback, if player hits some object from right
    if (player.yCoor <= object.yObj + object.objHeight - 4
        && player.yCoor + player.pHeight >= object.yObj + 4//player hits object from bottom
        && player.xCoor + player.pWidth >= object.xObj + object.objWidth - 4//player hits object from left
        && player.xCoor <= object.xObj + object.objWidth) {

        player.blowback = 0;
        player.collision = true;
        return;
    }

    if (object instanceof SlideObject) {

        //if player is right now sliding under an object and slide key is released, so player stops slide
        //stop slide not yet executed and now prevented
        //player gets punished for trying to stand up to early by sliding slower until the object is over
        if (player.yCoor > object.yObj + object.objHeight
            && player.xCoor + player.pWidth >= object.xObj //player hits object from left
            && player.xCoor <= object.xObj + object.objWidth) {

            if (player.stopslide) {
                player.blowback = vel / 2;
                player.friction = player.blowback; // so player is blown back just one animation frame and then
                //checked for collision again -> still under slide obj?
                player.collision = true;
                return;
            }
        }
        //you can't walk on top of slide obj
        if (player.yCoor <= object.yObj + object.objHeight
            && player.yCoor + player.pHeight >= object.yObj
            && player.xCoor + player.pWidth >= object.xObj
            && player.xCoor <= object.xObj + object.objWidth) {

            player.blowback = vel * 4;
            player.friction = player.blowback / 20;
            player.collision = true;
        }
    }

    if (object instanceof ExtraSpeed) {
        if (player.yCoor <= object.yObj + object.objHeight //player hits object from bottom
            && player.yCoor + player.pHeight >= object.yObj // player hits object from top
            && player.xCoor + player.pWidth >= object.xObj //player hits object from left
            && player.xCoor <= object.xObj + object.objWidth) {
            player.push = 4 * vel;
            player.friction = player.push / 20
            object.removeObject();
            return;
        }
    }

    //you can walk on top of slide/jump and jump obj
    if (object instanceof Ufo || object instanceof JumpObject) {

        if (player.yCoor <= object.yObj + object.objHeight
            && player.yCoor + player.pHeight >= object.yObj
            && player.xCoor + player.pWidth >= object.xObj
            && player.xCoor <= object.xObj + object.objWidth) {
            //Object is hit from top
            if (player.anotherjump
                &&player.yCoor + player.pHeight <= object.yObj + 2
                && player.yCoor + player.pHeight > object.yObj - 2
                && player.xCoor >= object.xObj + 4
                && player.xCoor + player.pWidth <= object.xObj + object.objWidth - 4) {
                player.jumpBoost = 0;
                return;
            }
            //if obj is hit from front --> blowback, else no blowback
            if (player.yCoor <= object.yObj + object.objHeight - 4
                && player.yCoor + player.pHeight >= object.yObj + 4
                && player.xCoor + player.pWidth >= object.xObj
                && player.xCoor <= object.xObj + 4) {

                player.blowback = vel * 4;
                player.friction = player.blowback / 20;
                player.collision = true;
                return;
            }
            //Object is hit from bottom => is bounced back
            if (player.yCoor <= object.yObj + object.objHeight
                && player.yCoor + player.pHeight >= object.yObj + object.objHeight - 4
                && player.xCoor + player.pWidth >= object.xObj + 4
                && player.xCoor <= object.xObj + object.objWidth - 4) {

                player.blocked = false;
                player.falldown = true;
                return;
            }
            player.blocked = true;
        }
    }

}


export {checkCollision}
