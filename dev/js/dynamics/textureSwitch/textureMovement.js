import { getPlayer, setPlayerDirection } from '../../player/player.js';
import { playerStats, setEquippedIdleTexture } from '../../player/playerData.js';
import { playerSheets, setIdleTexture } from '../../sheets/playerSheets.js';
import { equippedItemLoop } from './utilties/equippedItemLoop.js';
import { changeTextureAnchor } from './utilties/textureXAnchors.js';
import { keysDown } from '../../controllers/keyboard.js';

let player;

export function movementPlayerTexture(textureDirection, textureId) {
    player = getPlayer();

    setIdleTexture(playerSheets['idle_' + textureId + '_' + textureDirection]);
    equippedItemLoop((equippedItem, slot) => {
        setEquippedIdleTexture(slot, playerSheets['idle_' + equippedItem.item + '_' + textureDirection]);
    })

    setPlayerDirection(textureDirection);
    
    if (!player.playing) {
        if (keysDown.ShiftLeft && playerStats.fatigue > 0) {
            player.textures = playerSheets['running_' + textureId + '_' + textureDirection];
            equippedItemLoop(equippedItem => {
                equippedItem.animatedSprite.children[0].textures = playerSheets['running_' + equippedItem.item + '_' + textureDirection];
            })
        } else {
            player.textures = playerSheets['walking_' + textureId + '_' + textureDirection];
            equippedItemLoop(equippedItem => {
                equippedItem.animatedSprite.children[0].textures = playerSheets['walking_' + equippedItem.item + '_' + textureDirection];
            })
        }
        changeTextureAnchor(player, textureDirection);
        equippedItemLoop(equippedItem => {
            changeTextureAnchor(equippedItem.animatedSprite.children[0], textureDirection);
        })
        player.play();
        equippedItemLoop(equippedItem => {
            equippedItem.animatedSprite.children[0].play();
        })
    }
}