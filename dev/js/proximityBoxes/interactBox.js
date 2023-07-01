import { Graphics } from '../_game.js';
import { uiStyle } from '../ui/ui_design.js';

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

// Create a interactBox for a container direct child of gameScene.
// complexY is set for weird sprites with alpha that dont match the height and width of the artwork.
export function interactBox(container, sprite, scale, complexY, test_graphic) {
    let ellipseX = container.x + (container.width / 2);
    let ellipseY = container.y + (container.height - (container.width * (complexY ? complexY : 1)) / 3);
    let ellipseWidth = (sprite.width) * scale;
    let ellipseHeight = (sprite.width / 1.45) * scale;
    
    // Create absolute interactBox
    container.interactBox = new Ellipse(ellipseX, ellipseY, ellipseWidth, ellipseHeight, uiStyle.colors.blue);

    // Create relative test interactBox graphic
    container.interactBox.graphics.x = sprite.x + sprite.width / 2;
    container.interactBox.graphics.y = sprite.y + sprite.height - ((sprite.width * (complexY ? complexY : 1)) / 3);
    container.interactBox.graphics.visible = false;
    container.addChild(container.interactBox.graphics);

    // Show test graphic if test_graphic returns true
    if (test_graphic) {
        container.interactBox.graphics.visible = true;
    }
}