import { keysDown } from './controls/keyboard.js';
import { getPlayer } from './player.js';
import { playerStats, getEquipped, getEquippedSlot, setEquippedAnimatedSprites, setEquippedIdleTexture } from './playerData.js';
import { playerSheets, getIdleTexture, setIdleTexture } from './sheets/playerSheets.js';
import { getBg, setBgX, setBgY } from './background.js';
import { getResourceMeters, setFatigue } from './ui/resourceMeters.js';
import { enemy } from './enemies/bandit.js';

// let environment = [getBg()].concat(enemies)
// function moveEnvironment(x, y) {
//     environment.forEach(function (item) {
//         item.y += y;
//         item.x += x;
//     })
// }

export let textureXAnchors = {
    'U': -0.05,
    'UR': -0.03,
    'R': 0,
    'DR': 0.05,
    'D': 0.03,
    'DL': 0.03,
    'L': 0,
    'UL': -0.03,
}

function changeTextureAnchor(texture, textureDirection) {
    texture.anchor.set(textureXAnchors[textureDirection], 0);
}

let playerDirection = 'DR';
export let getPlayerDirection = () => playerDirection;

function moveEnvironment(x, y) {
    setBgX(getBg().x += x);
    setBgY(getBg().y += y);
    enemy.x += x;
    enemy.y += y;
}

export function playerMovement() {
    let player = getPlayer();
    let playerPlaying = player.playing;

    function equippedItemLoopAnchor(textureDirection) {
        Object.keys(getEquipped()).map(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                changeTextureAnchor(equippedItem.animatedSprite, textureDirection);
            }
        })
    }

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
        playerDirection = textureDirection;
        if (!player.playing) {
            if (keysDown.ShiftLeft) {
                player.textures = playerSheets['running_noArmorNaked_' + textureDirection];
                equippedItemLoopTexture('running', textureDirection);
            } else {
                player.textures = playerSheets['walking_noArmorNaked_' + textureDirection];
                equippedItemLoopTexture('walking', textureDirection);
            }
            changeTextureAnchor(player, textureDirection);
            equippedItemLoopAnchor(textureDirection);
            player.play();
            equippedItemLoopPlay();
        }
    }

    function setPlayerSpeed() {
        if (playerPlaying) {
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
        } else if (keysDown.KeyS) {
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
        if (!playerPlaying) {
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