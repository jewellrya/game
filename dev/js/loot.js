import { Container, Sprite, Graphics } from './_game.js';
import { getMiscSheet } from './sheets/miscSheet.js';
import { getPlayer } from './player.js';
import { uiStyle } from './ui/ui_design.js';
import { Ellipse, ellipseCollides } from './hurtbox.js';

export let loot = [];
let lootScale = 2.5;
let player;

export function lootInstance(x, y, facingDirection) {
    let open = false;
    player = getPlayer();

    let lootInstance = new Container();
    lootInstance.x = x;
    lootInstance.y = y;
    lootInstance.scale.set(lootScale);
    lootInstance.interactive = true;
    let spriteClosed = getMiscSheet()['treasure-closed-' + facingDirection + '.png'];
    let spriteOpen = getMiscSheet()['treasure-open-' + facingDirection + '.png'];
    let sprite = new Sprite(spriteClosed);

    lootInstance.addChild(sprite);

    let hurtboxScale = 2;
    lootInstance.ellipse = new Ellipse(lootInstance.x + lootInstance.width / 2, lootInstance.y + lootInstance.height / 1.45, lootInstance.width / (2 / hurtboxScale), lootInstance.height / (3 / hurtboxScale));

    let hurtbox = new Graphics();
    hurtbox.beginFill(uiStyle.colors.red, .25);
    hurtbox.drawEllipse(sprite.x + sprite.width / 2, sprite.y + sprite.height / 1.45, sprite.width / (2 / hurtboxScale), sprite.height / (3 / hurtboxScale));

    lootInstance.addChild(hurtbox);
    loot.push(lootInstance);

    lootInstance.on('click', function () {
        let xShift, yShift;
        if (facingDirection === 'D') {
            xShift = 0 * lootScale;
            yShift = 7 * lootScale;
        } else {
            xShift = 4 * lootScale;
            yShift = 2 * lootScale;
        }
        if (!open) {
            sprite.texture = spriteOpen;
            lootInstance.y -= yShift;
            lootInstance.x -= xShift;
            hurtbox.y += yShift / 2.5;
            hurtbox.x += xShift / 2.5;
            open = true;
        } else {
            sprite.texture = spriteClosed;
            open = false;
            lootInstance.y += yShift;
            lootInstance.x += xShift;
            hurtbox.y -= yShift / 2.5;
            hurtbox.x -= xShift / 2.5;
        }
    })

    return lootInstance;
}

export function lootCollide_listener() {
    loot.forEach(derp => {
        if (ellipseCollides(player.ellipse, derp.ellipse)) {
            console.log('collide');
        }
    })
    // if(ellipseCollides(player.ellipse, sprite.ellipse)) {
    //     console.log('collide');
    // }
}