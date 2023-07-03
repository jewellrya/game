import { getPlayer, playerDirection, playerBodyTexture } from '../../player/player.js';
import { setPlayerAnimSpeed } from '../textureSwitch/textureAnimSpeed.js';
import { attackPlayerTexture } from '../textureSwitch/textureAttack.js';
import { keysPressed } from '../../controllers/keyboard.js';

let player;

export let isAttacking = false;
export let playerDealDamage = false;
let attackKeyReleased = true;
let attackCooldown = 1000;
let lastAttack = Date.now();
let attackQueue = [];
let attackAnimationFrame = 0;

// Attack
export function attack() {
    player = getPlayer();

    

    if (attackKeyReleased && Date.now() - lastAttack >= attackCooldown) {
        attackQueue.push(Date.now());
        lastAttack = Date.now();
        attackKeyReleased = false;
    }

    if (!isAttacking && attackQueue.length > 0) {
        isAttacking = true;

        player.gotoAndPlay(0);
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

export function attack_control() {
    if (keysPressed.Space) {
        attack();
    } else {
        attackKeyReleased = true;
    }

    if (isAttacking) {
        attackAnimationFrame++;
        if (attackAnimationFrame === 30) {
            // Fix queue thing here.
            playerDealDamage = true;
        } else {
            playerDealDamage = false;
        }
    } else {
        attackAnimationFrame = 0;
    }
}
