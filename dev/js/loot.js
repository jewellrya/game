import { Container, Sprite, Graphics, getClickRegistered } from './_game.js';
import { getMiscSheet } from './sheets/miscSheet.js';
import { getPlayer } from './player.js';
import { uiStyle } from './ui/ui_design.js';
import { Ellipse, ellipseCollides } from './hurtbox.js';

export let lootArray = [];
let lootScale = 2.5;
let player;
let clickRegistered;

export function lootInstance(x, y, direction) {
    clickRegistered = getClickRegistered();
    player = getPlayer();
    let container = new Container();
    container.x = x;
    container.y = y;
    container.scale.set(lootScale);
    container.interactive = true;
    let sprite_closed = getMiscSheet()['treasure-closed-' + direction + '.png'];
    let sprite_open = getMiscSheet()['treasure-open-' + direction + '.png'];
    let sprite = new Sprite(sprite_closed);

    container.addChild(sprite);

    let hurtboxScale = 2;
    container.ellipse = new Ellipse(container.x + container.width / 2, container.y + container.height / 1.45, container.width / (2 / hurtboxScale), container.height / (3 / hurtboxScale));

    // // Temporary Graphic
    // let hurtbox = new Graphics();
    // hurtbox.beginFill(uiStyle.colors.red, .25);
    // hurtbox.drawEllipse(sprite.x + sprite.width / 2, sprite.y + sprite.height / 1.45, sprite.width / (2 / hurtboxScale), sprite.height / (3 / hurtboxScale));
    // container.addChild(hurtbox);

    lootArray.push({
        direction: direction,
        container: container,
        hasListener: false,
        sprite: {
            current: sprite,
            sprite_closed: sprite_closed,
            sprite_open: sprite_open,
        },
        open: false,
    })

    return container;
}

export function lootCollide_listener() {
    lootArray.forEach(loot => {
        let xShift, yShift = 0;
        if (loot.direction === 'D') {
            xShift = 0 * lootScale;
            yShift = 7 * lootScale;
        } else {
            xShift = 4 * lootScale;
            yShift = 2 * lootScale;
        }
        if (ellipseCollides(player.ellipse, loot.container.ellipse)) {
            if (!clickRegistered) {
                loot.container.once('pointerdown', function () {
                    loot.hasListener = true;
                    
                    if (!loot.open) {
                        loot.open = true;
                        loot.sprite.current.texture = loot.sprite.sprite_open;
                        loot.container.y -= yShift;
                        loot.container.x -= xShift;
                        loot.container.ellipse.y += (yShift / 2.5);
                        loot.container.ellipse.x += (xShift / 2.5);

                        // // Temp Graphic
                        // loot.container.children[1].y += yShift / 2.5;
                        // loot.container.children[1].x += xShift / 2.5;
                    } else {
                        loot.open = false;
                        loot.sprite.current.texture = loot.sprite.sprite_closed;
                        loot.container.y += yShift;
                        loot.container.x += xShift;
                        loot.container.ellipse.y -= yShift / 2.5;
                        loot.container.ellipse.x -= xShift / 2.5;

                        // // temp Graphic
                        // loot.container.children[1].y -= yShift / 2.5;
                        // loot.container.children[1].x -= xShift / 2.5;
                    }
                    clickRegistered = false;
                })
                clickRegistered = true;
            }
        } else {
            if (loot.hasListener) {
                clickRegistered = false;
                loot.hasListener = false;
                loot.container.removeAllListeners();

                if (loot.open) {
                    loot.open = false;
                    loot.sprite.current.texture = loot.sprite.sprite_closed;
                    loot.container.y += yShift;
                    loot.container.x += xShift;
                    loot.container.ellipse.y -= yShift / 2.5;
                    loot.container.ellipse.x -= xShift / 2.5;

                    // // temp Graphic
                    // loot.container.children[1].y -= yShift / 2.5;
                    // loot.container.children[1].x -= xShift / 2.5;
                }
            }
        }
    })
}