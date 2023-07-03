import { Container, Sprite, AnimatedSprite } from '../../../_game.js';
import { getPlayerContainer } from '../../../player/player.js';
import { interactBox } from '../../../proximityBoxes/interactBox.js';
import { boxCollides } from '../../../proximityBoxes/_box.js';
import { aggroBox } from '../../../proximityBoxes/aggroBox.js';
import { entitySheets } from '../../../sheets/entitySheet.js';
import { getMiscSheet } from '../../../sheets/miscSheet.js';

let rats = [];
let ratScale = 1.25;
let ratAnimationSpeed = .5;

let playerContainer;

export function createEnemy_rat() {
    playerContainer = getPlayerContainer();
    
    let ratDirection = 'DL';

    let rat = new Container();
    rat.x = 600;
    rat.y = 300;

    let sprite = new AnimatedSprite(entitySheets['idle_rat_' + ratDirection]);
    sprite.animationSpeed = ratAnimationSpeed;
    sprite.scale.set(ratScale);

    let base = new Sprite(getMiscSheet()['dropShadow.png']);
    base.scale.set(ratScale * 4.5, ratScale * 4.5);
    base.x = sprite.x + (sprite.width / 2) - (base.width / 2);
    base.y = sprite.y + sprite.height - 50;

    rat.addChild(base);
    rat.addChild(sprite);

    sprite.play();

    interactBox(rat, sprite, .75, 0.5, false);
    let aggroFactor = 5;
    aggroBox(rat, sprite, aggroFactor, 0.5, false);

    rats.push({
        container: rat,
        sprite: sprite,
        direction: ratDirection,
    });
    return rat;
}

export function aggroEnemy_rat() {
    rats.forEach(rat => {
        if (boxCollides(playerContainer.interactBox, rat.container.aggroBox)) {

            let target = playerContainer.interactBox;
            let mover = rat.container.interactBox;
            let speed = ratAnimationSpeed * 2.5;

            let dx = target.x - mover.x;
            let dy = target.y - mover.y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            let sumOfRadii = Math.min(target.rx, target.ry) + Math.min(mover.rx, mover.ry);

            dx /= distance;
            dy /= distance;

            if (distance > sumOfRadii) {
                let newDirection = calculateDirection(dx, dy);

                if (rat.direction !== newDirection) {
                    rat.direction = newDirection;
                    rat.sprite.textures = entitySheets['walking_rat_' + rat.direction];
                    rat.sprite.play();
                }
                
                let movementX = dx * speed;
                let movementY = dy * speed;
                
                rat.container.x += movementX;
                rat.container.y += movementY;
                rat.container.interactBox.x += movementX;
                rat.container.interactBox.y += movementY;
                rat.container.aggroBox.x += movementX;
                rat.container.aggroBox.y += movementY;
            }

            function calculateDirection(dx, dy) {
                // Calculate the angle of the direction vector
                let angle = Math.atan2(dy, dx);

                // Adjust the angle to be between 0 and 2π
                if (angle < 0) {
                    angle += 2 * Math.PI;
                }

                // Map the angle to one of the 8 directions
                let directions = ['R', 'DR', 'D', 'DL', 'L', 'UL', 'U', 'UR'];
                let directionIndex = Math.round(angle / (2 * Math.PI / directions.length)) % directions.length;
                return directions[directionIndex];
                // direction gives string rat needs to face.
            }
        }
    })
}

export function contactEnemy_rat() {
    rats.forEach(rat => {
        if (boxCollides(playerContainer.interactBox, rat.container.interactBox)) {
            console.log('Rat Contact!');
        }
    })
}
