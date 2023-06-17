// numberOfRats = 2;
// let ratContainer = new Container();
// ratContainer.name = "rats";
// gameScene.addChild(ratContainer);
// for (let i = 0; i < numberOfRats; i++) {
//     let rat = createEnemy(bg, "rat");
//     enemies.push(rat);
//     ratContainer.addChild(rat);
// }

// enemies.forEach(function (enemy) {
//     enemy.cursor = 'hover';
//     enemy.interactive = true;
//     var range = 100;

//     // If enemy is within range of player's base
//     if (enemy.x + enemy.width >= player.x - range
//         && enemy.x <= player.x + player.width + range
//         && enemy.y + enemy.height >= player.y - range
//         && enemy.y <= player.y + player.height + range
//     ) {
//         if (enemy.x + (enemy.width / 2) < player.x + (player.width / 2)) {
//             enemy.x += enemy.speed;
//         }
//         if (enemy.x + (enemy.width / 2) > player.x + (player.width / 2)) {
//             enemy.x += -enemy.speed;
//         }
//         if (enemy.y + (enemy.height / 2) < player.y + (player.height / 2)) {
//             enemy.y += enemy.speed;
//         }
//         if (enemy.y + (enemy.height / 2) > player.y + (player.height / 2)) {
//             enemy.y += -enemy.speed;
//         }
//     } else {
//         enemy.x += enemy.speed * enemy.direction;
//         if (enemy.x >= bg.x + bg.width - enemy.width ||
//             enemy.x <= bg.x) {
//             enemy.direction *= -1;
//         }
//     }
// })

// if (hitTestRectangle(gold, player)) {
//     ++inventory.currency.gold;
//     gold.x = randomInt(bg.x, bg.x + bg.width - gold.width);
//     gold.y = randomInt(bg.y, bg.y + bg.height - gold.height);
//     bagUiGoldText.text = inventory.currency.gold;
// }

// let ratCage = gameScene.getChildByName("rats");
// for (let i = 0; i < numberOfRats - enemies.length; i++) {
//     let rat = createEnemy(bg, "rat");
//     enemies.push(rat);
//     ratCage.addChild(rat);
// }
// enemies.forEach(function (enemy, index) {
//     if (hitTestRectangle(enemy, player)) {
//         if (playerStats.health > 0) {
//             playerStats.health -= enemy.strength;
//             resourceMeters.types.health.inner.width = playerStats.health * 2 - resourceMeters.innerOffset * 2;
//         }

//         if (click['mouse']) {
//             if (enemy.health > 0) {
//                 enemy.health -= playerStats.strength;
//             }
//             if (enemy.health <= 0) {
//                 enemies.splice(index, 1);
//                 enemy.visible = false
//             }

//         }
//     }
// })