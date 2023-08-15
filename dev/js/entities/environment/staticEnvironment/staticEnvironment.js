import { Sprite, Container } from '../../../_game.js';
import { environmentSheets } from '../../../sheets/environmentSheet.js';
import { interactBox } from '../../../proximityBoxes/interactBox.js';

export function staticEnvironmentInstance(spriteId, x, y) {
    let staticEnvironment = new Container();
    staticEnvironment.x = x;
    staticEnvironment.y = y;
    
    let sprite = new Sprite(environmentSheets[spriteId]);
    sprite.scale.set(3.5);

    staticEnvironment.addChild(sprite);

    interactBox({container: staticEnvironment, sprite, scale: .8, complexY: .8, test_graphic: false});

    return staticEnvironment;
}