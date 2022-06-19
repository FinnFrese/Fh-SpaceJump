import {player1} from "./Control.js";

function mobileUserControl() {
    var touchstartX = 0;
    var touchstartY = 0;
    var touchendX = 0;
    var touchendY = 0;
    var timer;
    var touchduration = 500; //length of time we want the user to touch before we do something

    var gesuredZone = document.querySelector("body");

    gesuredZone.addEventListener('touchstart', function (event) {

        timer = setTimeout(() => {
            if (player1.jump === false) {
                player1.slide = true;
            }
        }, touchduration);

        touchstartX = event.screenX;
        touchstartY = event.screenY;
    }, false);

    gesuredZone.addEventListener('touchend', function (event) {
        if (player1.slide) {
            if (player1.jump === false && player1.slide) {
                player1.stopslide = true;
                if (timer) clearTimeout(timer);
            }
        }
        touchendX = event.screenX;
        touchendY = event.screenY;
        handleGesture();
    }, false);

    function handleGesture() {
        // swipe up
        if (touchendY > touchstartY) {
            //set some variables, so loop can react to user input
            if (player1.slide === false && player1.jump === false) {
                player1.jump = true;
                player1.falldown = false;
                player1.jumpVel = player1.startJumpVel;
            } else if (player1.jump && player1.blocked) {
                player1.jump = true;
                player1.falldown = false;
                player1.jumpVel = player1.startJumpVel;
                player1.blocked = false; //for jumping while standing on object
                player1.anotherjump = true;
            }
        }
    }
}
export{mobileUserControl}