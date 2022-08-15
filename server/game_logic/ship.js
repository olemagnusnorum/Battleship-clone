class Ship {

    constructor(){
        this.ROTATION_ANGLE = 90
        this.offsets = null
        this.centerPieceIndex = null
        this.size = null
        this.sunk = false
        this.placed = false
    }

    rotateRight(rotation){
        for (var i = 0; i < this.offsets.length; i++){
            if (i !== this.centerPieceIndex){
                var x = this.offsets[i].x
                var y = this.offsets[i].y
                var new_x = x * Math.round(Math.cos(this.ROTATION_ANGLE*rotation*(Math.PI/180))) - y * Math.round(Math.sin(this.ROTATION_ANGLE*rotation*(Math.PI/180)));
                var new_y = x * Math.round(Math.sin(this.ROTATION_ANGLE*rotation*(Math.PI/180))) + y * Math.round(Math.cos(this.ROTATION_ANGLE*rotation*(Math.PI/180)));
                this.offsets[i].x = new_x, 
                this.offsets[i].y = new_y;
            }
        }
        return this.offsets;
    }

    damageShip(){
        this.size -= 1;
        if (this.size === 0){
            this.sunk = true;
        }
    }

    isSunk(){
        return this.sunk;
    }

}

export class ThreePieceShip extends Ship {

    constructor(){
        super();
        this.offsets = [{"x":0,"y":-1}, {"x":0,"y":0}, {"x":0,"y":1}];
        this.centerPieceIndex = 1;
        this.size = 3;
    }
}

export class SmallLShip extends Ship {

    constructor(){
        super();
        this.offsets = [{"x":0,"y":-1}, {"x":0,"y":0}, {"x":1,"y":0}];
        this.centerPieceIndex = 1;
        this.size = 3;
    }
}

export class BigLShip extends Ship {

    constructor(){
        super();
        this.offsets = [{"x":0,"y":-2}, {"x":0,"y":-1}, {"x":0,"y":0}, {"x":1,"y":0}, {"x":2,"y":0} ];
        this.centerPieceIndex = 2;
        this.size = 5;
    }
}