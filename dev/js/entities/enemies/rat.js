import { Container, Graphics } from '../../_game.js';
import { uiStyle } from '../../ui/ui_design.js';
import { getPlayer } from '../../player/player.js';
import { interactBox } from '../../proximityBoxes/interactBox.js';

export let rat;
let player;

let enemySpeed = 1.2;
let aggroDistance = 200;

export function createEnemy() {
    player = getPlayer();

    rat = new Container();
    rat.x = 800;
    rat.y = 150;

    let sprite = new Graphics();
    sprite.beginFill(uiStyle.colors.cyan);
    sprite.drawRect(0, 0, 75, 40);
    rat.addChild(sprite);

    interactBox(rat, sprite, 1.25, 0.5, true);

    return rat;
}

export function enemyAggroListener() {
    
}