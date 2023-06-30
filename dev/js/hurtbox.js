import { Graphics } from './_game.js';

export class Ellipse {
    constructor(x, y, rx, ry) {
        this.x = x;
        this.y = y;
        this.rx = rx;
        this.ry = ry;
        
        this.graphics = new Graphics();
        this.draw();
    }

    draw() {
        this.graphics.clear();
        this.graphics.beginFill('0xff0000', .25);
        this.graphics.drawEllipse(0, 0, this.rx, this.ry);
        this.graphics.endFill();
    }
}

export function ellipseCollides(e1, e2) {
    // Translate coordinates to origin
    let dx = e1.x - e2.x;
    let dy = e1.y - e2.y;

    // Scale ellipses to circles
    dx /= (e1.rx + e2.rx);
    dy /= (e1.ry + e2.ry);

    // Perform a regular circle collision check
    return dx * dx + dy * dy <= 1;
}