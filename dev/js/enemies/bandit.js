import { Container, Graphics } from '../_game.js';
import { uiStyle } from '../ui/ui_design.js';
import { getPlayer, playerHurtbox } from '../player.js';
import { Ellipse, interactBox } from '../interactBox.js';

export let enemy;
export let enemyHitbox;
let player;

let enemySpeed = 1.2;
let aggroDistance = 200;

export function createEnemy() {
    player = getPlayer();

    enemy = new Container();
    enemy.x = 800;
    enemy.y = 150;

    let enemySprite = new Graphics();
    enemySprite.beginFill(uiStyle.colors.cyan);
    enemySprite.drawRect(0, 0, 40, 120);
    enemy.addChild(enemySprite);

    interactBox(enemy, enemySprite, 2.25, false, true);

    return enemy;
}

export function enemyAggroListener() {
}