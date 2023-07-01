import { app, Container, AnimatedSprite, Sprite } from '../_game.js';
import { playerSheets, setIdleTexture } from '../sheets/playerSheets.js';
import { getMiscSheet } from '../sheets/miscSheet.js';
import { getEquipped, getEquippedSlot } from './playerData.js';
import { getIdleTexture } from '../sheets/playerSheets.js';
import { getPlayerDirection, textureXAnchors } from '../dynamics/playerDynamics.js';
import { interactBox } from '../proximityBoxes/interactBox.js';

export let playerSpriteScale = 2;
export let playerHurtbox;

let playerContainer;
export let getPlayerContainer = () => playerContainer;
export let setPlayerContainer = (val) => playerContainer = val;

let player;
export let getPlayer = () => player;
export let setPlayer = (val) => player = val;
export let playerPlay = () => player.play();
export let setPlayerTexture = (val) => player.textures = val;

let playerStartingDirection = 'DR';

export function createPlayer() {
    setIdleTexture(playerSheets['idle_noArmorNaked_' + playerStartingDirection]);
    playerContainer = new Container();

    player = new AnimatedSprite(getIdleTexture());
    player.scale.set(playerSpriteScale);
    player.animationSpeed = .6;
    player.loop = false;
    player.anchor.set(textureXAnchors['DR'], 0);

    let playerBase = new Sprite(getMiscSheet()['dropShadow.png']);
    playerBase.scale.set(playerSpriteScale * 2.25, playerSpriteScale * 2.25);
    playerBase.x = player.x + (player.width / 2) - (playerBase.width / 2);
    playerBase.y = player.y + player.height - 85;
    
    playerContainer.addChild(playerBase);
    playerContainer.addChild(player);

    player.play();

    playerContainer.x = (app.view.width - (player.width)) / 2;
    playerContainer.y = (app.view.height - (player.height)) / 2;
    interactBox(playerContainer, player, 0.4, 0.9, true);

    return playerContainer;
}

export function createPlayerArmor() {
    Object.keys(getEquipped()).map(slot => {
        let player = getPlayer();
        let playerContainer = getPlayerContainer();
        let equippedItem = getEquippedSlot(slot);
        equippedItem.animatedSprite = new Container();
        if (equippedItem.item) {
            let sheet = new AnimatedSprite(playerSheets['idle_' + equippedItem.item + '_' + playerStartingDirection]);
            sheet.x = player.x;
            sheet.y = player.y;
            sheet.scale.set(playerSpriteScale);
            sheet.animationSpeed = player.animationSpeed;
            sheet.loop = false;
            sheet.anchor.set(textureXAnchors[playerStartingDirection], 0);
            sheet.play();
            equippedItem.idleTexture = playerSheets['idle_' + equippedItem.item + '_' + playerStartingDirection];
            equippedItem.animatedSprite.addChild(sheet);
        }
        playerContainer.addChild(equippedItem.animatedSprite);
    })
}

export function createNewPlayerArmor(slot) {
    // call after "equipped" is updated
    let player = getPlayer();
    let equippedItem = getEquippedSlot(slot);
    let sheet = new AnimatedSprite(playerSheets['idle_' + equippedItem.item + '_' + getPlayerDirection()]);
    sheet.x = player.x;
    sheet.y = player.y;
    sheet.scale.set(playerSpriteScale);
    sheet.animationSpeed = player.animationSpeed;
    sheet.loop = false;
    sheet.anchor.set(textureXAnchors[getPlayerDirection()], 0);
    sheet.play();
    equippedItem.idleTexture = playerSheets['idle_' + equippedItem.item + '_' + getPlayerDirection()];
    equippedItem.animatedSprite.addChild(sheet);
}

export function destroyPlayerArmor(slot) {
    let equippedItem = getEquippedSlot(slot);
    equippedItem.animatedSprite.removeChild(equippedItem.animatedSprite.children[0]);
    equippedItem.item = null;
    equippedItem.idleTexture = null;

    // if pants make player = humanMale_body_*;
}

// function for swapping armor with the same armor slots.