import { socket, container, contHeight, contWidth } from "./main.js"

function gatherForJson(player) {
    var xCord = player.xCoor/contWidth*100;
    var yCord = player.yCoor
    let pHeight = player.pHeight;
    let pWidth = player.pWidth;
    if (yCord > 0) {
        yCord = contHeight - yCord - contHeight/8;
    } else {
        yCord = 0
    }

    var losing = player.lose
    let winning = player.win;

    var json = {
        xCord: xCord,
        yCord: yCord,
        pWidth: pWidth,
        pHeight: pHeight,
        losing: losing,
        winning: winning,
    }

    socket.emit('PlInfo', JSON.stringify(json));
}
var plnmbr;
function playernumber(msg){
    console.log(msg);
plnmbr = msg-1;
if(plnmbr===1){
    plnmbr=0
}else{
    plnmbr=1
}
}

export { gatherForJson, playernumber, plnmbr }