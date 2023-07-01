import { Container, Sprite, Graphics, getClickRegistered } from '../../_game.js';
import { getMiscSheet } from '../../sheets/miscSheet.js';
import { getPlayerContainer } from '../../player/player.js';
import { Ellipse, ellipseCollides, interactBox } from '../../proximityBoxes/interactBox.js';
import { keysPressed } from '../../controllers/keyboard.js';

export let lootArray = [];
let lootScale = 2.5;
let playerContainer;
let clickRegistered;

export function lootInstance(x, y, direction) {
    clickRegistered = getClickRegistered();
    playerContainer = getPlayerContainer();
    let container = new Container();
    container.x = x;
    container.y = y;
    container.scale.set(lootScale);
    container.interactive = true;
    let sprite_closed = getMiscSheet()['treasure-closed-' + direction + '.png'];
    let sprite_open = getMiscSheet()['treasure-open-' + direction + '.png'];
    let sprite = new Sprite(sprite_closed);
    container.addChild(sprite);

    interactBox(container, sprite, 1.5, false, true);

    // E Indicator
    let indicator = new Sprite(getMiscSheet()['e-indicator.png']);
    indicator.scale.set(0.5);
    indicator.x = sprite.width / 2 - indicator.width / 2;
    indicator.y = -10;
    indicator.visible = false;
    container.addChild(indicator);

    lootArray.push({
        direction: direction,
        container: container,
        indicator: indicator,
        keyReleased: true,
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
        if (ellipseCollides(playerContainer.interactBox, loot.container.interactBox)) {
            loot.indicator.visible = true;
            function toggleLoot() {
                if (loot.keyReleased) {
                    loot.keyReleased = false;
                    
                    if (!loot.open) {
                        loot.open = true;
                        loot.sprite.current.texture = loot.sprite.sprite_open;
                        loot.container.x -= xShift;
                        loot.container.y -= yShift;
                        loot.container.interactBox.x += (xShift / 2.5);
                        loot.container.interactBox.y += (yShift / 2.5);
                        loot.container.interactBox.graphics.x += (xShift / 2.5);
                        loot.container.interactBox.graphics.y += (yShift / 2.5);
                        

                    } else {
                        loot.open = false;
                        loot.sprite.current.texture = loot.sprite.sprite_closed;
                        loot.container.x += xShift;
                        loot.container.y += yShift;
                        loot.container.interactBox.x -= xShift / 2.5;
                        loot.container.interactBox.y -= yShift / 2.5;
                        loot.container.interactBox.graphics.x -= (xShift / 2.5);
                        loot.container.interactBox.graphics.y -= (yShift / 2.5);
                    }
                }
            }

            if (keysPressed.KeyE) {
                toggleLoot();
            } else {
                loot.keyReleased = true;
            }

        } else {
            if (loot.indicator.visible) {
                loot.indicator.visible = false;
            }
            
            if (loot.open) {
                loot.open = false;
                loot.sprite.current.texture = loot.sprite.sprite_closed;
                loot.container.y += yShift;
                loot.container.x += xShift;
                loot.container.interactBox.y -= yShift / 2.5;
                loot.container.interactBox.x -= xShift / 2.5;
                loot.container.interactBox.graphics.x -= (xShift / 2.5);
                loot.container.interactBox.graphics.y -= (yShift / 2.5);

                // // temp Graphic
                // loot.container.children[1].y -= yShift / 2.5;
                // loot.container.children[1].x -= xShift / 2.5;
            }
        }
    })
}