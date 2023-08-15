import { Ellipse } from './_box.js';
import { uiStyle } from '../ui/ui_design.js';

// Create a aggroBox for a container direct child of gameScene.
// Currently meant for objects height > width.
// complexY is set for weird sprites with alpha that dont match the height and width of the artwork.
export function aggroBox({container, sprite, scale = 1, complexY = null, test_graphic = false}) {
    let ellipseX = container.x + (container.width / 2);
    let ellipseY = container.y + (container.height - (container.width * (complexY ? complexY : 1)) / 3);
    let ellipseWidth = (sprite.width) * scale;
    let ellipseHeight = (sprite.width / 1.45) * scale;
    
    // Create absolute aggroBox
    container.aggroBox = new Ellipse(ellipseX, ellipseY, ellipseWidth, ellipseHeight, uiStyle.colors.red);

    // Create relative test aggroBox graphic
    container.aggroBox.graphics.x = sprite.x + sprite.width / 2;
    container.aggroBox.graphics.y = sprite.y + sprite.height - ((sprite.width * (complexY ? complexY : 1)) / 3);
    container.aggroBox.graphics.visible = false;
    container.addChild(container.aggroBox.graphics);

    // Show test graphic if test_graphic returns true
    if (test_graphic) {
        container.aggroBox.graphics.visible = true;
    }
}