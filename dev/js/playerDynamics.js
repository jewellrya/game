import { keysDown, keysPressed, keyboard } from './controllers/keyboard.js';
import { getPlayer } from './player.js';
import { playerStats, getEquipped, getEquippedSlot, setEquippedAnimatedSprites, setEquippedIdleTexture } from './playerData.js';
import { playerSheets, getIdleTexture, setIdleTexture } from './sheets/playerSheets.js';
import { getBg, setBgX, setBgY } from './background.js';
import { getResourceMeters, setFatigue } from './ui/modules/resourceMeters.js';
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
let attackKeyReleased = true;

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

export function keysDownResetPlayer_listener() {
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

export function playerDynamics() {
    let player = getPlayer();
    let playerPlaying = player.playing;

    function equippedItemLoop(callback) {
        Object.keys(getEquipped()).forEach(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                callback(equippedItem, slot);
            }
        })
    }

    function movementPlayerTexture(textureDirection) {
        // Instead setting these, make player stop moving and initiate attack.
        setIdleTexture(playerSheets['idle_noArmorNaked_' + textureDirection]);
        equippedItemLoop((equippedItem, slot) => {
            setEquippedIdleTexture(slot, playerSheets['idle_' + equippedItem.item + '_' + textureDirection]);
        })
        playerDirection = textureDirection;
        if (!player.playing) {
            if (keysDown.ShiftLeft && playerStats.fatigue > 0) {
                player.textures = playerSheets['running_noArmorNaked_' + textureDirection];
                equippedItemLoop(equippedItem => {
                    equippedItem.animatedSprite.children[0].textures = playerSheets['running_' + equippedItem.item + '_' + textureDirection];
                })
            } else {
                player.textures = playerSheets['walking_noArmorNaked_' + textureDirection];
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
        isAttacking = false;
        attackQueue = [];
        attackKeyReleased = true;
    }

    function setPlayerAnimSpeed() {
        if (playerPlaying) {
            if (keysDown.ShiftLeft && playerStats.fatigue > 0) {
                // Running
                let speed = playerStats.dexterity / 20;
                player.animationSpeed = speed;
                equippedItemLoop(equippedItem => {
                    equippedItem.animatedSprite.children[0].animationSpeed = speed;
                })
            } else if (keysPressed.Space && isAttacking) {
                // Melee Attacking
                let speed = playerStats.dexterity / 25;
                player.animationSpeed = speed;
                equippedItemLoop(equippedItem => {
                    equippedItem.animatedSprite.children[0].animationSpeed = speed;
                })
            } else {
                // Walking
                let speed = playerStats.dexterity / 20;
                player.animationSpeed = speed;
                equippedItemLoop(equippedItem => {
                    equippedItem.animatedSprite.children[0].animationSpeed = speed;
                })
            }
        } else {
            // Idle
            let speed = .6;
            player.animationSpeed = speed;
            equippedItemLoop(equippedItem => {
                equippedItem.animatedSprite.children[0].animationSpeed = speed;
            })
            player.play();
            equippedItemLoop(equippedItem => {
                equippedItem.animatedSprite.children[0].play();
            })
        }
    }

    function attackPlayerTexture(textureDirection) {
        setIdleTexture(playerSheets['1hAttackIdle_noArmorNaked_' + textureDirection]);
        equippedItemLoop((equippedItem, slot) => {
            setEquippedIdleTexture(slot, playerSheets['1hAttackIdle_' + equippedItem.item + '_' + textureDirection]);
        })
        if (!player.playing) {
            player.textures = playerSheets['1hAttack_noArmorNaked_' + textureDirection];
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
        setPlayerAnimSpeed();
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
        setPlayerAnimSpeed();
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
        setPlayerAnimSpeed();
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
        setPlayerAnimSpeed();
    }

    // Attack
    function attack() {
        if (attackKeyReleased && Date.now() - lastAttack >= attackCooldown) {
            attackQueue.push(Date.now());
            lastAttack = Date.now();
            attackKeyReleased = false;
        }

        if (!isAttacking && attackQueue.length > 0) {
            isAttacking = true;

            getPlayer().gotoAndStop(0);
            setPlayerAnimSpeed();
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
            equippedItemLoop((equippedItem, slot) => {
                setEquippedAnimatedSprites(slot, getEquippedSlot(slot).animatedSprite.children[0].textures = getEquippedSlot(slot).idleTexture);
                setEquippedAnimatedSprites(slot, getEquippedSlot(slot).animatedSprite.children[0].play());
            })
        }

        // Attack
        if (keysPressed.Space) {
            attack();

        } else {
            attackKeyReleased = true;
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
            }, 4000);
        } else {
            playerStats.fatigue += playerStats.fatigueRegen;
        }
        setFatigue(playerStats.fatigue * 2 - getResourceMeters().innerOffset * 2);
    }

    if (playerStats.fatigue <= 0) {
        movementPlayerTexture(playerDirection);
        setPlayerAnimSpeed();
    }
}