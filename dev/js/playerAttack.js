import { click } from './controls/mouse.js';

let attackSpeed = 10;

let attackInProgress = false;
export function playerAttack() {
    if (click.mouse && !attackInProgress) {
        
        
        
        attackInProgress = true;
        setTimeout(function () {
            attackInProgress = false;
        }, 1000 - (attackSpeed * 5));
    }
}