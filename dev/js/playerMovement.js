import { keysDown, keysPressed, keyboard } from './controls/keyboard.js';
import { getPlayer } from './player.js';
import { playerStats, getEquipped, getEquippedSlot, setEquippedAnimatedSprites, setEquippedIdleTexture } from './playerData.js';
import { playerSheets, getIdleTexture, setIdleTexture } from './sheets/playerSheets.js';
import { getBg, setBgX, setBgY } from './background.js';
import { getResourceMeters, setFatigue } from './ui/resourceMeters.js';
import { enemy } from './enemies/bandit.js';

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

let attackCooldown = 1000;
let lastAttack = Date.now();
let isAttacking = false;
let attackQueue = [];

function changeTextureAnchor(texture, textureDirection) {
    texture.anchor.set(textureXAnchors[textureDirection], 0);
}

let playerDirection = 'DR';
export let getPlayerDirection = () => playerDirection;

function moveEnvironment(x, y) {
    setBgX(getBg().x += x);
    setBgY(getBg().y += y);
    // Wrap in an Array when more than one.
    enemy.x += x;
    enemy.y += y;
}

export function resetPlayerAnimations() {
    // Reset player animation with keysDown
    Object.keys(keysDown).map(key => {
        keyboard(key).press = () => {
            getPlayer().gotoAndStop(0);
        }
        keyboard(key).release = () => {
            getPlayer().gotoAndStop(0);
        }
    })
}

export function playerMovement() {
    let player = getPlayer();
    let playerPlaying = player.playing;

    function equippedItemLoopAnchor(textureDirection) {
        Object.keys(getEquipped()).map(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                changeTextureAnchor(equippedItem.animatedSprite.children[0], textureDirection);
            }
        })
    }

    function equippedItemLoopTexture(animation, textureDirection) {
        Object.keys(getEquipped()).map(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                equippedItem.animatedSprite.children[0].textures = playerSheets[animation + '_' + equippedItem.item + '_' + textureDirection];
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

    function equippedItemLoopAttackIdleTexture(textureDirection) {
        Object.keys(getEquipped()).map(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                setEquippedIdleTexture(slot, playerSheets['1hAttackIdle_' + equippedItem.item + '_' + textureDirection]);
            }
        })
    }

    function equippedItemLoopPlay() {
        Object.keys(getEquipped()).map(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                equippedItem.animatedSprite.children[0].play();
            }
        })
    }

    function equippedItemLoopAnimationSpeed(speed) {
        Object.keys(getEquipped()).map(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                equippedItem.animatedSprite.children[0].animationSpeed = speed;
            }
        })
    }

    function equippedItemLoopChangeIdle() {
        Object.keys(getEquipped()).map(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                setEquippedAnimatedSprites(slot, getEquippedSlot(slot).animatedSprite.children[0].textures = getEquippedSlot(slot).idleTexture);
                setEquippedAnimatedSprites(slot, getEquippedSlot(slot).animatedSprite.children[0].play());
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

            isAttacking = false;
            attackQueue = [];
        }
    }

    function setPlayerSpeed() {
        if (playerPlaying) {
            if (keysDown.ShiftLeft) {
                // Running
                player.animationSpeed = playerStats.dexterity / 20;
                equippedItemLoopAnimationSpeed(playerStats.dexterity / 20);
            } else if (keysPressed.KeyE && isAttacking) {
                // Melee Attacking
                player.animationSpeed = playerStats.dexterity / 25;
                equippedItemLoopAnimationSpeed(playerStats.dexterity / 25);
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

    function attackPlayerTexture(textureDirection) {
        setIdleTexture(playerSheets['1hAttackIdle_noArmorNaked_' + textureDirection]);
        equippedItemLoopAttackIdleTexture(textureDirection);
        if (!player.playing) {
            player.textures = playerSheets['1hAttack_noArmorNaked_' + textureDirection];
            equippedItemLoopTexture('1hAttack', textureDirection);
            changeTextureAnchor(player, textureDirection);
            equippedItemLoopAnchor(textureDirection);
            player.play();
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

    // Attack
    function attack() {
        if (Date.now() - lastAttack >= attackCooldown) {
            attackQueue.push(Date.now());
            lastAttack = Date.now();
        }

        if (!isAttacking && attackQueue.length > 0) {
            isAttacking = true;

            getPlayer().gotoAndStop(0);
            setPlayerSpeed();
            attackPlayerTexture(playerDirection);

            player.onComplete = () => {
                isAttacking = false;
                
                // Remove the completed attack from queue
                attackQueue.shift();

                // if there's another attack in the queue, start it
                if (attackQueue.length > 0) {
                    attack();
                }
            }
        }
    }

    if (!keysDown.KeyW && !keysDown.KeyA && !keysDown.KeyS && !keysDown.KeyD) {

        // Idle animation if no keys are true
        if (!playerPlaying) {
            player.textures = getIdleTexture();
            player.play();
            equippedItemLoopChangeIdle();
        }

        // Attack
        if (keysPressed.KeyE) {
            attack();
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