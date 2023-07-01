import { Ellipse } from './box.js';
import { uiStyle } from '../ui/ui_design.js';

// Create a interactBox for a container direct child of gameScene.
// Currently meant for objects height > width.
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