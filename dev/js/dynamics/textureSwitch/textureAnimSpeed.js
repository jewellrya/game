import { getPlayer } from '../../player/player.js';
import { playerStats } from '../../player/playerData.js';
import { isAttacking, attackAnimationSpeed } from '../attacks/attackMelee.js';
import { equippedItemLoop } from './utilties/equippedItemLoop.js';
import { keysDown } from '../../controllers/keyboard.js';

let player;

export function setPlayerAnimSpeed() {
    player = getPlayer();

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
            let speed = attackAnimationSpeed;
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