import { getPlayer, playerDirection, playerBodyTexture } from '../../player/player.js';
import { playerStats, getEquippedSlot, setEquippedAnimatedSprites } from '../../player/playerData.js';
import { getIdleTexture } from '../../sheets/playerSheets.js';
import { moveEnvironment } from './moveEnvironment.js';
import { isAttacking } from '../attacks/attackMelee.js';
import { movementPlayerTexture } from '../textureSwitch/textureMovement.js';
import { setPlayerAnimSpeed } from '../textureSwitch/textureAnimSpeed.js';
import { equippedItemLoop } from '../textureSwitch/utilties/equippedItemLoop.js';
import { setFatigue, getResourceMeters } from '../../ui/modules/resourceMeters.js';
import { keysDown } from '../../controllers/keyboard.js';
import { updateCoordinates } from './updateCoords.js';

let player;

export function movement_control() {
    player = getPlayer();

    if (!isAttacking) {
        // keysDown
        if (keysDown.KeyW) {
            if (keysDown.KeyA) {
                movementPlayerTexture('UL', playerBodyTexture);
            } else if (keysDown.KeyD) {
                movementPlayerTexture('UR', playerBodyTexture);
            } else {
                movementPlayerTexture('U', playerBodyTexture);
            }
            updateCoordinates(0, -playerStats.speed());
            moveEnvironment(0, playerStats.speed());
            setPlayerAnimSpeed();
        }

        if (keysDown.KeyA) {
            if (keysDown.KeyW) {
                movementPlayerTexture('UL', playerBodyTexture);
            } else if (keysDown.KeyS) {
                movementPlayerTexture('DL', playerBodyTexture);
            } else {
                movementPlayerTexture('L', playerBodyTexture);
            }
            updateCoordinates(-playerStats.speed(), 0);
            moveEnvironment(playerStats.speed(), 0);
            setPlayerAnimSpeed();
        }

        if (keysDown.KeyS) {
            if (keysDown.KeyA) {
                movementPlayerTexture('DL', playerBodyTexture);
            } else if (keysDown.KeyD) {
                movementPlayerTexture('DR', playerBodyTexture);
            } else {
                movementPlayerTexture('D', playerBodyTexture);
            }
            updateCoordinates(0, playerStats.speed());
            moveEnvironment(0, -playerStats.speed());
            setPlayerAnimSpeed();
        }

        if (keysDown.KeyD) {
            if (keysDown.KeyW) {
                movementPlayerTexture('UR', playerBodyTexture);
            } else if (keysDown.KeyS) {
                movementPlayerTexture('DR', playerBodyTexture);
            } else {
                movementPlayerTexture('R', playerBodyTexture);
            }
            updateCoordinates(playerStats.speed(), 0);
            moveEnvironment(-playerStats.speed(), 0);
            setPlayerAnimSpeed();
        }
    }

    if (!keysDown.KeyW && !keysDown.KeyA && !keysDown.KeyS && !keysDown.KeyD) {
        // Idle animation if no keys are true
        if (!player.playing) {
            player.textures = getIdleTexture();
            player.play();
            equippedItemLoop((equippedItem, slot) => {
                setEquippedAnimatedSprites(slot, getEquippedSlot(slot).animatedSprite.children[0].textures = getEquippedSlot(slot).idleTexture);
                setEquippedAnimatedSprites(slot, getEquippedSlot(slot).animatedSprite.children[0].play());
            })
        }
    }

    // Bug Here - adds more fatigue after running out?
    // After running out and letting it fill without hitting shift.
    // Move to its own file and test.

    let totalFatigue = 10 + (playerStats.endurance * 0.2);
    let regenState = true;

    // Running Reduce Fatigue
    if (keysDown.ShiftLeft) {
        regenState = false;
        if (playerStats.fatigue > 0) {
            playerStats.fatigue -= (playerStats.fatigueCost);
            setFatigue(playerStats.fatigue);
        }
    } else {
        regenState = true;
    }
    
    if (playerStats.fatigue <= totalFatigue && regenState) {
        playerStats.fatigue += playerStats.fatigueRegen;
        setFatigue(playerStats.fatigue);
    }

    if (playerStats.fatigue <= 0) {
        movementPlayerTexture(playerDirection, playerBodyTexture);
        setPlayerAnimSpeed();
    }
}