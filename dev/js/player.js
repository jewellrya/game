import { app, Container, AnimatedSprite, Sprite } from './_game.js';
import { playerSheets, setIdleTexture } from './sheets/playerSheets.js';
import { getMiscSheet } from './sheets/miscSheet.js';

export let playerSpriteScale = 2;

let playerContainer;
export let getPlayerContainer = () => playerContainer;
export let setPlayerContainer = (val) => playerContainer = val;

let player;
export let getPlayer = () => player;
export let setPlayer = (val) => player = val;

export function createPlayer() {
    setIdleTexture(playerSheets.idle_noArmorNaked_DR);

    playerContainer = new Container();

    player = new AnimatedSprite(playerSheets.idle_noArmorNaked_DR);
    player.x = (app.view.width - (player.width * playerSpriteScale)) / 2;
    player.y = (app.view.height - (player.height * playerSpriteScale)) / 2;
    player.scale.set(playerSpriteScale);
    player.animationSpeed = .1;
    player.loop = false;
    player.play();

    let playerBase = new Sprite(getMiscSheet()['dropShadow.png']);
    playerBase.scale.set(playerSpriteScale * 1.5, playerSpriteScale * 1.5);
    playerBase.x = player.x + (player.width / 2) - 15;
    playerBase.y = player.y + player.height - 80;

    playerContainer.addChild(playerBase);
    playerContainer.addChild(player);

    return playerContainer;
}