import { socket, container, contHeight, contWidth } from "./main.js"

function gatherForJson(player) {
    let xCord = player.xCoor/contWidth*100;
    let yCord = player.yCoor
    let pHeight = player.pHeight;
    let pWidth = player.pWidth;
    if (player.yCoor < contHeight - player.pHeight) {
        yCord = contHeight - yCord - player.pHeight;
    } else {
        yCord = 0; //for more stability
    }

    let losing = player.lose
    let winning = player.win;

    let json = {
        xCord: xCord,
        yCord: yCord,
        pWidth: pWidth,
        pHeight: pHeight,
        losing: losing,
        winning: winning,
    }

    socket.emit('PlInfo', JSON.stringify(json));
}
let plnmbr;
function playernumber(msg){
    //console.log(msg);
plnmbr = msg-1;
if(plnmbr===1){
    plnmbr=0
}else{
    plnmbr=1
}
}

export { gatherForJson, playernumber, plnmbr }