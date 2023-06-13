import { keyboard, keysDown } from './controls/keyboard.js';
import { player } from './_game.js';
import { playerStats, getEquipped, getEquippedSlot, setEquippedAnimatedSprites, setEquippedIdleTexture } from './playerData.js';
import { playerSheets, getIdleTexture, setIdleTexture } from './sheets/playerSheets.js';
import { getBg, setBgX, setBgY } from './background.js';
import { getResourceMeters, setFatigue } from './ui/resourceMeters.js';

// let environment = [getBg()].concat(enemies)
// function moveEnvironment(x, y) {
//     environment.forEach(function (item) {
//         item.y += y;
//         item.x += x;
//     })
// }

function moveEnvironment(x, y) {
    setBgX(getBg().x += x);
    setBgY(getBg().y += y);
}

export function playerMovement() {
    Object.keys(keysDown).map(key => {
        keyboard(key).press = () => {
            keysDown[key] = true;
        }
        keyboard(key).release = () => {
            keysDown[key] = false;
        }
    })

    function equippedItemLoopTexture(animation, textureDirection) {
        Object.keys(getEquipped()).map(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                equippedItem.animatedSprite.textures = playerSheets[animation + '_' + equippedItem.item + '_' + textureDirection];
            }
        })
    }

    function equippedItemLoopIdleTexture(textureDirection) {
        Object.keys(getEquipped()).map(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                setEquippedIdleTexture(slot, playerSheets['idle_' + equippedItem.item + '_' + textureDirection]);
            }
        })
    }

    function equippedItemLoopPlay() {
        Object.keys(getEquipped()).map(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                equippedItem.animatedSprite.play();
            }
        })
    }

    function equippedItemLoopAnimationSpeed(speed) {
        Object.keys(getEquipped()).map(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                equippedItem.animatedSprite.animationSpeed = speed;
            }
        })
    }

    function equippedItemLoopChangeIdle() {
        Object.keys(getEquipped()).map(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                setEquippedAnimatedSprites(slot, getEquippedSlot(slot).animatedSprite.textures = getEquippedSlot(slot).idleTexture);
                setEquippedAnimatedSprites(slot, getEquippedSlot(slot).animatedSprite.play());
            }
        })
    }

    function movementPlayerTexture(textureDirection) {
        setIdleTexture(playerSheets['idle_noArmorNaked_' + textureDirection]);
        equippedItemLoopIdleTexture(textureDirection);
        if (!player.playing) {
            if (keysDown.ShiftLeft) {
                player.textures = playerSheets['running_noArmorNaked_' + textureDirection];
                equippedItemLoopTexture('running', textureDirection);
            } else {
                player.textures = playerSheets['walking_noArmorNaked_' + textureDirection];
                equippedItemLoopTexture('walking', textureDirection);
            }
            player.play();
            equippedItemLoopPlay();
        }
    }

    function setPlayerSpeed() {
        if (player.playing) {
            if (keysDown.ShiftLeft) {
                // Running
                player.animationSpeed = playerStats.dexterity / 20;
                equippedItemLoopAnimationSpeed(playerStats.dexterity / 20);
            } else {
                // Walking
                player.animationSpeed = playerStats.dexterity / 20;
                equippedItemLoopAnimationSpeed(playerStats.dexterity / 20);
            }
        } else {
            // Idle
            player.animationSpeed = .6;
            player.play();
            equippedItemLoopAnimationSpeed(.6);
            equippedItemLoopPlay();
        }
    }

    // keysDown
    if (keysDown.KeyW) {
        if (keysDown.KeyA) {
            movementPlayerTexture('UL');
        } else if (keysDown.KeyD) {
            movementPlayerTexture('UR');
        } else {
            movementPlayerTexture('U');
        }
        moveEnvironment(0, playerStats.speed());
        setPlayerSpeed();
    }

    if (keysDown.KeyA) {
        if (keysDown.KeyW) {
            movementPlayerTexture('UL');
        }
        else if (keysDown.KeyS) {
            movementPlayerTexture('DL');
        } else {
            movementPlayerTexture('L');
        }
        moveEnvironment(playerStats.speed(), 0);
        setPlayerSpeed();
    }

    if (keysDown.KeyS) {
        if (keysDown.KeyA) {
            movementPlayerTexture('DL');
        } else if (keysDown.KeyD) {
            movementPlayerTexture('DR');
        } else {
            movementPlayerTexture('D');
        }
        moveEnvironment(0, -playerStats.speed());
        setPlayerSpeed();
    }

    if (keysDown.KeyD) {
        if (keysDown.KeyW) {
            movementPlayerTexture('UR');
        } else if (keysDown.KeyS) {
            movementPlayerTexture('DR');
        } else {
            movementPlayerTexture('R');
        }
        moveEnvironment(-playerStats.speed(), 0);
        setPlayerSpeed();
    }

    // Idle animation if no keys are true
    if (!keysDown.KeyW && !keysDown.KeyA && !keysDown.KeyS && !keysDown.KeyD) {
        if (!player.playing) {
            player.textures = getIdleTexture();
            player.play();
            equippedItemLoopChangeIdle();
        }
    }

    // Running Reduce Fatigue
    if (keysDown.ShiftLeft) {
        if (playerStats.fatigue > 0) {
            playerStats.fatigue -= (playerStats.fatigueCost + playerStats.fatigueRegen);
        }
        setFatigue(playerStats.fatigue * 2 - getResourceMeters().innerOffset * 2);
    }

    if (playerStats.fatigue < playerStats.endurance) {
        if (playerStats.fatigue <= playerStats.fatigueRegen) {
            setTimeout(function () {
                playerStats.fatigue += playerStats.fatigueRegen;
            }, 3000);
        } else {
            playerStats.fatigue += playerStats.fatigueRegen;
        }
        setFatigue(playerStats.fatigue * 2 - getResourceMeters().innerOffset * 2);
    }
}