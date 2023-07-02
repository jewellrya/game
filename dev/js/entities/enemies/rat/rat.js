import { Container, Graphics } from '../../../_game.js';
import { uiStyle } from '../../../ui/ui_design.js';
import { getPlayerContainer } from '../../../player/player.js';
import { interactBox } from '../../../proximityBoxes/interactBox.js';
import { boxCollides, boxDistance } from '../../../proximityBoxes/_box.js';
import { aggroBox } from '../../../proximityBoxes/aggroBox.js';

let rats = [];
let playerContainer;

export function createEnemy_rat() {
    playerContainer = getPlayerContainer();

    let rat = new Container();
    rat.x = 800;
    rat.y = 150;

    let sprite = new Graphics();
    sprite.beginFill(uiStyle.colors.cyan);
    sprite.drawRect(0, 0, 75, 40);
    rat.addChild(sprite);

    interactBox(rat, sprite, .75, 0.5, true);
    let aggroFactor = 5;
    aggroBox(rat, sprite, aggroFactor, 0.5, true);

    rats.push(rat);
    return rat;
}

export function aggroEnemy_rat() {
    rats.forEach(rat => {
        if (boxCollides(playerContainer.interactBox, rat.aggroBox)) {
            let target = playerContainer.interactBox;
            let mover = rat.interactBox;
            let speed = .5; // 2

            let dx = target.x - mover.x;
            let dy = target.y - mover.y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            let sumOfRadii = Math.min(target.rx, target.ry) + Math.min(mover.rx, mover.ry);

            dx /= distance;
            dy /= distance;

            if (distance > sumOfRadii) {
                let movementX = dx * speed;
                let movementY = dy * speed;

                rat.x += movementX;
                rat.y += movementY;
                rat.interactBox.x += movementX;
                rat.interactBox.y += movementY;
                rat.aggroBox.x += movementX;
                rat.aggroBox.y += movementY;
            }

            // Calculate the angle of the direction vector
            let angle = Math.atan2(dy, dx);

            // Adjust the angle to be between 0 and 2π
            if (angle < 0) {
                angle += 2 * Math.PI;
            }

            // Map the angle to one of the 8 directions
            let directions = ['R', 'DR', 'D', 'DL', 'L', 'UL', 'U', 'UR'];
            let directionIndex = Math.round(angle / (2 * Math.PI / directions.length)) % directions.length;
            let direction = directions[directionIndex];
            // direction gives string rat needs to face.
        }
    })
}

export function contactEnemy_rat() {
    rats.forEach(rat => {
        if (boxCollides(playerContainer.interactBox, rat.interactBox)) {
            console.log('Rat Contact!');
        }
    })
}
