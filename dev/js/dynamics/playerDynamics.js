import { keysDown, keyboard } from '../controllers/keyboard.js';
import { getPlayer } from '../player/player.js';
import { isAttacking } from './attacks/attackMelee.js';
import { movement_control } from './movement/playerMovement.js';
import { attack_control } from './attacks/attackMelee.js';

export function playerDynamics() {
    movement_control();
    attack_control();
}

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
