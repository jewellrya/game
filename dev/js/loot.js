import { Container, Sprite } from './_game.js';
import { getMiscSheet } from './sheets/miscSheet.js';

export let loot;

export function lootInstance(facingDirection) {
    loot = new Container();
    loot.x = 550;
    loot.y = 150;
    loot.scale.set(2, 2);
    let sprite = new Sprite(getMiscSheet()['treasure-closed-' + facingDirection + '.png']);
    loot.addChild(sprite);
    return loot;
}