import{contWidth, contHeight} from "./main.js";
//Possible sizes of an Object (jump, slide) (small, medium, large)
const ObjectSize = {
    S: 'S',
    M: 'M',
    L: 'L',
};

class SomeObject {
    objectDiv;
    _objHeight;
    _objWidth;
    _finalWidth;
    _xObj;
    _yObj;
    _objVel;
    objImage;

    constructor() {
        this.objectExists = false; //to create each Object just once
        this._color = '';
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }

    get objHeight() {
        return this._objHeight;
    }

    set objHeight(value) {
        this._objHeight = value;
    }

    get objWidth() {
        return this._objWidth;
    }

    set objWidth(value) {
        this._objWidth = value;
    }

    get finalWidth() {
        return this._finalWidth;
    }

    set finalWidth(value) {
        this._finalWidth = value;
    }

    get xObj() {
        return this._xObj;
    }

    set xObj(value) {
        this._xObj = value;
    }

    get yObj() {
        return this._yObj;
    }

    set yObj(value) {
        this._yObj = value;
    }

    moveX(objectDeviationX) {
        this._xObj += objectDeviationX;
    }

    moveY(objectDeviationY) {
        this._yObj += objectDeviationY;
    }



    renderObject(){
        //if object already exists just render position and size
        if(this.objectExists) {
            this.objectDiv.style.height = this._objHeight + 'px';
            this.objectDiv.style.width = this._objWidth + 'px';
            this.objectDiv.style.top = this._yObj + 'px';
            this.objectDiv.style.left = this._xObj + 'px';
        }
        else {
            this.objectDiv = document.createElement('div');
            this.objectDiv.style.cssText = `left: ${this._xObj}px; top: ${this._yObj}px; height: ${this._objHeight}px; width: ${this._objWidth}px; background-color: ${this._color};`;
            window.container.insertAdjacentElement('afterbegin', this.objectDiv)
            //add image
            if(this.objImage) {
                let elem = document.createElement("img");
                elem.src = this.objImage;
                this.objectDiv.appendChild(elem);
                elem.style.height = this._objHeight + 'px';
                elem.style.width = this._finalWidth + 'px';
                console.log(this._objWidth)
                console.log(this.xObj)
            }

            this.objectExists = true;
        }
    }

    deleteObject() {
        this.objectDiv.remove();
    }
}


class JumpObject extends SomeObject{
    constructor(size) {
        super();
        if (ObjectSize.hasOwnProperty(size)) { //check if input has right format
            switch (size) {
                case 'S':
                    this._objHeight = Math.round(contHeight / 15);
                    this._finalWidth = Math.round(contWidth / 16);
                    break;
                case 'M':
                    this._objHeight = Math.round(contHeight / 12);
                    this._finalWidth = Math.round(contWidth / 13);
                    break;
                case 'L':
                    this._objHeight = Math.round(contHeight / 10);
                    this._finalWidth = Math.round(contWidth / 10);
                    break;
            }
        }
        //Start position for Object
        this._xObj = contWidth;
        this._yObj = contHeight - this._objHeight;
        this.objImage = '../View/Krater.png'
        this._objWidth = 0;
        this._objVel = 0;
        this._color = false;
    }

    renderObject() {
        super.renderObject();
        this.objectDiv.style.zIndex = "2";
        this.objectDiv.classList.add('object');
    }
}


class Ufo extends SomeObject{

    constructor(size) {
        super();
        this._objHeight = Math.round(contHeight / 20);
        this._finalWidth = Math.round(contWidth / 8);
        if (ObjectSize.hasOwnProperty(size)) { //check if input has right format
            switch (size) {
                case 'S':
                    this._objVel = 0;
                    this._yObj = contHeight - this._objHeight - Math.round(contHeight / 13); //lets object hover
                    break;
                case 'M':
                    this.objVel = contWidth*0.0007;
                    this._yObj = contHeight - this._objHeight - 3*Math.round(contHeight / 13); //lets object hover
                    break;
                case 'L':
                    this.objVel = contWidth*0.0007;
                    this._yObj = contHeight - this._objHeight - 5*Math.round(contHeight / 13); //lets object hover
                    break;

            }
        }
        //Start position for Object
        this._xObj = contWidth;
        this.objImage = '../View/Ufo.png'
        this._objWidth = 0;
        this._color = false;
    }
    renderObject() {
        super.renderObject();
        this.objectDiv.style.zIndex = "2";
        this.objectDiv.classList.add('object');
    }
}

class SlideObject extends SomeObject {

    constructor(size) {
        super();
        if (ObjectSize.hasOwnProperty(size)) { //check if input has right format
            switch (size) {
                case 'S':
                    this._objHeight = Math.round(contHeight / 4);
                    this._finalWidth = Math.round(contWidth / 16);
                    break;
                case 'M':
                    this._objHeight = Math.round(contHeight / 4);
                    this._finalWidth = Math.round(contWidth / 13);
                    break;
                case 'L':
                    this._objHeight = Math.round(contHeight / 4);
                    this._finalWidth = Math.round(contWidth / 6);
                    break;

            }
        }
        //Start position for Object
        this._xObj = contWidth;
        this._yObj = contHeight - this._objHeight - Math.round(contHeight / 14); //lets object hover
        //this.objImage = '../View/Ufo.png'
        this._objWidth = 0;
        this._objVel = 0;
        this._color = "blue";
    }
    renderObject() {
        super.renderObject();
        this.objectDiv.style.zIndex = "2";
        this.objectDiv.classList.add('object');
    }
}

class ExtraSpeed extends SomeObject {
    constructor() {
        super();
        this._objHeight = Math.round(contHeight / 14);
        this._finalWidth = Math.round(contWidth / 35);
        this._xObj = contWidth;
        this._yObj = contHeight - this._objHeight - Math.round(contHeight / 6); //lets object hover
        //this.objImage = '../View/Ufo.png'
        this._objWidth = 0;
        this._objVel = 0;
        this._color = "yellow";
    }
    renderObject() {
        super.renderObject();
        this.objectDiv.style.zIndex = "2";
        this.objectDiv.classList.add('object');
    }
    removeObject() {
        this.objectDiv.style.display = "none";
        this._xObj = -1;
        this._yObj = -1;
        this._objWidth = 0;
        this._objHeight = 0;
    }
}

function createObjectArray(levelObject, levelindex) {
    let level = levelObject[levelindex]
    let ObjectArray = [];
    let distance = 0; //distance to first object
    let increaseDistance = Math.round(contWidth / 6); //distance between each Object (x-coordinate)
    let j = 0; //objectArrayIndex
    let l = 0; //levelArrayIndex


            level.forEach((object) => {
                let Obj;
                switch(object.type) {
                    case "none":
                        distance += increaseDistance;
                        return;
                    case "jump":
                        Obj = new JumpObject(object.size);
                        break;
                    case "ufo":
                        Obj = new Ufo(object.size);
                        break;
                    case "slide":
                        Obj = new SlideObject(object.size);
                        break;
                    case "speed":
                        Obj = new ExtraSpeed();
                        break;
                }
                ObjectArray[j] = Obj;
                Obj.moveX(distance);
                distance += increaseDistance;
                j++;
            })
return ObjectArray;
}

class Star extends SomeObject {
    constructor() {
        super();
        this._xObj = Math.random() * contWidth;
        this._yObj = Math.random() * contHeight;
        this._objWidth = contHeight/500 + Math.random() * ( 1 - contHeight/500 )
        this._objHeight = contHeight/500 + Math.random() * ( 1 - contHeight/500 )
        this._color = '#FFFFFF';
    }

    renderObject() {
        super.renderObject();
        this.objectDiv.classList.add('star');
    }
}

function createStarArray() {
    let stars = [];
    const STAR_COUNT = ( contWidth + contHeight ) / 8;
    for (let i = 0; i < STAR_COUNT; i++) {
        let star = new Star();
        stars.push(star)
    }
    return stars;
}

function createStars() {
    let stars = createStarArray()
    for(let i = 0 ; i < stars.length ; i++) {
        let star = stars[i];
        star.renderObject();
    }
    return stars;
}



export{JumpObject, Star, createStars, createObjectArray,SlideObject,Ufo,ExtraSpeed}
