import { app, Container, AnimatedSprite, Sprite } from './_game.js';
import { playerSheets, setIdleTexture } from './sheets/playerSheets.js';
import { getMiscSheet } from './sheets/miscSheet.js';
import { getEquipped, getEquippedSlot } from './playerData.js';
import { createPlayerSheet, getIdleTexture } from './sheets/playerSheets.js';
import { getPlayerDirection } from './playerMovement.js';

export let playerSpriteScale = 2;

let playerContainer;
export let getPlayerContainer = () => playerContainer;
export let setPlayerContainer = (val) => playerContainer = val;

let player;
export let getPlayer = () => player;
export let setPlayer = (val) => player = val;
export let playerPlay = () => player.play();
export let setPlayerTexture = (val) => player.textures = val;

export function createPlayer() {
    createPlayerSheet('humanMale', 'noArmorNaked');
    setIdleTexture(playerSheets.idle_noArmorNaked_DR);
    playerContainer = new Container();

    player = new AnimatedSprite(getIdleTexture());
    player.x = (app.view.width - (player.width * playerSpriteScale)) / 2;
    player.y = (app.view.height - (player.height * playerSpriteScale)) / 2;
    player.scale.set(playerSpriteScale);
    player.animationSpeed = .1;
    player.loop = false;

    let playerBase = new Sprite(getMiscSheet()['dropShadow.png']);
    playerBase.scale.set(playerSpriteScale * 1.5, playerSpriteScale * 1.5);
    playerBase.x = player.x + (player.width / 2) - 15;
    playerBase.y = player.y + player.height - 80;

    playerContainer.addChild(playerBase);
    playerContainer.addChild(player);

    player.play();

    return playerContainer;
}

export function createPlayerArmor() {
    Object.keys(getEquipped()).map(slot => {
        let player = getPlayer();
        let playerContainer = getPlayerContainer();
        let equippedItem = getEquippedSlot(slot);
        if (equippedItem.item) {
            createPlayerSheet('humanMale', equippedItem.item);
            equippedItem.animatedSprite = new AnimatedSprite(playerSheets['idle_' + equippedItem.item + '_DR']);
            equippedItem.animatedSprite.x = player.x;
            equippedItem.animatedSprite.y = player.y;
            equippedItem.animatedSprite.scale.set(playerSpriteScale);
            equippedItem.animatedSprite.animationSpeed = player.animationSpeed;
            equippedItem.animatedSprite.loop = false;
            equippedItem.idleTexture = playerSheets['idle_' + equippedItem.item + '_DR'];
            equippedItem.animatedSprite.play();
            playerContainer.addChild(equippedItem.animatedSprite);
        }
    })
}

export function createNewPlayerArmor(slot) {
    // call after "equipped" is updated
    let player = getPlayer();
    let playerContainer = getPlayerContainer();
    let equippedItem = getEquippedSlot(slot);
    createPlayerSheet('humanMale', equippedItem.item);
    equippedItem.animatedSprite = new AnimatedSprite(playerSheets['idle_' + equippedItem.item + '_' + getPlayerDirection()]);
    equippedItem.animatedSprite.x = player.x;
    equippedItem.animatedSprite.y = player.y;
    equippedItem.animatedSprite.scale.set(playerSpriteScale);
    equippedItem.animatedSprite.animationSpeed = player.animationSpeed;
    equippedItem.animatedSprite.loop = false;
    equippedItem.idleTexture = playerSheets['idle_' + equippedItem.item + '_' + getPlayerDirection()];
    equippedItem.animatedSprite.play();
    playerContainer.addChild(equippedItem.animatedSprite);
}