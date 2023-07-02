import { keysDown, keysPressed, keyboard } from '../controllers/keyboard.js';
import { getPlayer, getPlayerBodyTexture, getPlayerDirection } from '../player/player.js';
import { playerStats, getEquipped, getEquippedSlot, setEquippedAnimatedSprites, setEquippedIdleTexture } from '../player/playerData.js';
import { playerSheets, getIdleTexture, setIdleTexture } from '../sheets/playerSheets.js';
import { getBg, setBgX, setBgY } from '../map/bg.js';
import { getResourceMeters, setFatigue } from '../ui/modules/resourceMeters.js';
import { gameScene } from '../_game.js';
import { entities } from '../entities/entities.js';

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

function moveEnvironment(x, y) {
    setBgX(getBg().x += x);
    setBgY(getBg().y += y);

    entities.forEach(entity => {
        entity.x += x;
        entity.y += y;
        entity.interactBox.x += x;
        entity.interactBox.y += y;
        if (entity.aggroBox) {
            entity.aggroBox.x += x;
            entity.aggroBox.y += y;
        }
    })

    gameScene.children.sort((a, b) => {
        return a.interactBox.y - b.interactBox.y;
    })

    if (playerStats.health <= 0) {
        state = end;
    }
}

let player;
let playerDirection;
let playerBodyTexture;

export function keysDownResetPlayer_listener() {
    // Reset player animation with keysDown
    Object.keys(keysDown).map(key => {
        keyboard(key).press = () => {
            if (!isAttacking) {
                getPlayer().gotoAndStop(0);
            }
            
        }
        keyboard(key).release = () => {
            if (!isAttacking) {
                getPlayer().gotoAndStop(0);
            }   
        }
    })
}

export function playerDynamics() {
    player = getPlayer();
    playerDirection = getPlayerDirection();
    playerBodyTexture = getPlayerBodyTexture();

    function equippedItemLoop(callback) {
        Object.keys(getEquipped()).forEach(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                callback(equippedItem, slot);
            }
        })
    }

    function movementPlayerTexture(textureDirection, textureId) {
        setIdleTexture(playerSheets['idle_' + textureId + '_' + textureDirection]);
        equippedItemLoop((equippedItem, slot) => {
            setEquippedIdleTexture(slot, playerSheets['idle_' + equippedItem.item + '_' + textureDirection]);
        })
        playerDirection = textureDirection;
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

    function setPlayerAnimSpeed() {
        if (player.playing) {
            if (keysDown.ShiftLeft && playerStats.fatigue > 0) {
                // Running
                let speed = playerStats.dexterity / 20;
                player.animationSpeed = speed;
                equippedItemLoop(equippedItem => {
                    equippedItem.animatedSprite.children[0].animationSpeed = speed;
                })
            } else if (isAttacking) {
                // Melee Attacking
                let speed = playerStats.dexterity / 20;
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

    function attackPlayerTexture(textureDirection, textureId) {
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
            moveEnvironment(-playerStats.speed(), 0);
            setPlayerAnimSpeed();
        }
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

            getPlayer().gotoAndPlay(0);
            setPlayerAnimSpeed();
            attackPlayerTexture(playerDirection, playerBodyTexture);

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

    // Attack
    if (keysPressed.Space) {
        attack();
    } else {
        attackKeyReleased = true;
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