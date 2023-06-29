import { Container, Graphics } from '../_game.js';
import { uiStyle } from '../ui/ui_design.js';
import { getPlayer, playerHurtbox } from '../player.js';

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

    enemyHitbox = new Graphics();
    enemyHitbox.beginFill(uiStyle.colors.red, 0);
    enemyHitbox.drawEllipse(0, 0, enemy.width, enemy.width / 1.75);
    enemyHitbox.x = enemy.width / 2;
    enemyHitbox.y = enemy.height - (enemy.width / 8);
    enemy.addChild(enemyHitbox);

    let aggroArea = aggroDistance + (enemyHitbox.width / 2);
    let enemyAggroDistance = new Graphics();
    enemyAggroDistance.beginFill(uiStyle.colors.red, 0);
    enemyAggroDistance.drawEllipse(0, 0, aggroArea, aggroArea / 1.75);
    enemyAggroDistance.x = enemyHitbox.x;
    enemyAggroDistance.y = enemyHitbox.y;
    enemy.addChild(enemyAggroDistance);

    return enemy;
}

export function enemyAggroListener() {
    // let enemyX = enemy.x + enemyHitbox.x;
    // let enemyY = enemy.y + enemyHitbox.y;
    // let playerX = playerHurtbox.x;
    // let playerY = playerHurtbox.y;
    // if (
    //     enemyX + enemyHitbox.width >= playerX - aggroDistance
    //     && enemyX <= playerX + playerHurtbox.width + aggroDistance
    //     && enemyY + enemyHitbox.height >= playerY - aggroDistance
    //     && enemyY <= playerY + playerHurtbox.height + aggroDistance
    // ) {
    //     if (enemyX >= playerX + 40) {
    //         enemy.x -= enemySpeed;
    //     }
    //     if (enemyX <= playerX - 40) {
    //         enemy.x += enemySpeed;
    //     }
    //     if (enemyY >= playerY + 40) {
    //         enemy.y -= enemySpeed;
    //     }
    //     if (enemyY <= playerY - 40) {
    //         enemy.y += enemySpeed;
    //     }
    // }
}