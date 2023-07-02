import { getPlayer } from '../../player/player.js';
import { setEquippedIdleTexture } from '../../player/playerData.js';
import { playerSheets, setIdleTexture } from '../../sheets/playerSheets.js';
import { equippedItemLoop } from './utilties/equippedItemLoop.js';
import { changeTextureAnchor } from './utilties/textureXAnchors.js';

let player;

export function attackPlayerTexture(textureDirection, textureId) {
    player = getPlayer();

    setIdleTexture(playerSheets['1hAttackIdle_' + textureId + '_' + textureDirection]);
    equippedItemLoop((equippedItem, slot) => {
        setEquippedIdleTexture(slot, playerSheets['1hAttackIdle_' + equippedItem.item + '_' + textureDirection]);
    })
    player.textures = playerSheets['1hAttack_' + textureId + '_' + textureDirection];
    equippedItemLoop(equippedItem => {
        equippedItem.animatedSprite.children[0].textures = playerSheets['1hAttack_' + equippedItem.item + '_' + textureDirection];
    })
    changeTextureAnchor(player, textureDirection);
    equippedItemLoop(equippedItem => {
        changeTextureAnchor(equippedItem.animatedSprite.children[0], textureDirection);
    })
    player.play();
    equippedItemLoop(equippedItem => {
        equippedItem.animatedSprite.children[0].play();
    })
}