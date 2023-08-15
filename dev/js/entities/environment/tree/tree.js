import { AnimatedSprite, Sprite, Container } from '../../../_game.js';
import { environmentSheets } from '../../../sheets/environmentSheet.js';
import { interactBox } from '../../../proximityBoxes/interactBox.js';

let treeAnimationSpeed = 0.01;

export function treeInstance(type, x, y) {
    let tree = new Container();
    tree.x = x;
    tree.y = y;
    
    let sprite = new AnimatedSprite(environmentSheets[type]);
    sprite.scale.set(3.5);
    sprite.animationSpeed = treeAnimationSpeed;
    sprite.play();

    let shadow = new AnimatedSprite(environmentSheets[type + 'shadow']);
    shadow.scale.set(3.5);
    shadow.animationSpeed = treeAnimationSpeed;
    shadow.play();
    shadow.x = 50;
    shadow.y = 520;
    
    tree.addChild(shadow);
    tree.addChild(sprite);

    interactBox({container: tree, sprite, scale: .05, complexY: 0.05, test_graphic: false});

    return tree;
}