import { Container, Graphics } from '../_game.js';
import { uiStyle } from '../ui/ui_design.js';
import { getPlayer, playerHurtbox } from '../player.js';
import { Ellipse, ellipseCollides } from '../hurtbox.js';

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
    enemySprite.drawRect(0, 0, 40, 100);
    enemy.addChild(enemySprite);

    let hurtboxScale = 3;
    enemy.ellipse = new Ellipse(enemySprite.x + (enemySprite.width / 2), enemy.y + enemySprite.y + enemySprite.height, enemySprite.width / (3 / hurtboxScale), enemySprite.height / (11 / hurtboxScale));
    enemy.ellipse.graphics.x = enemySprite.width / 2;
    enemy.ellipse.graphics.y = enemySprite.height;
    enemy.addChild(enemy.ellipse.graphics);

    return enemy;
}

export function enemyAggroListener() {
}