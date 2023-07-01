import { Graphics } from '../_game.js';

export class Ellipse {
    constructor(x, y, rx, ry, color) {
        this.x = x;
        this.y = y;
        this.rx = rx;
        this.ry = ry;
        this.color = color;
        
        this.graphics = new Graphics();
        this.draw();
    }

    draw() {
        this.graphics.clear();
        this.graphics.beginFill(this.color, .25);
        this.graphics.drawEllipse(0, 0, this.rx / 1.45, this.ry / 1.45);
        this.graphics.endFill();
    }
}

export function boxCollides(e1, e2) {
    // Translate coordinates to origin
    let dx = e1.x - e2.x;
    let dy = e1.y - e2.y;

    // Scale ellipses to circles
    dx /= (e1.rx + e2.rx);
    dy /= (e1.ry + e2.ry);

    // Perform a regular circle collision check
    return dx * dx + dy * dy <= 1;
}