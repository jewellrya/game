import { Container, Sprite, AnimatedSprite, Graphics } from '../../../_game.js';
import { getPlayerContainer } from '../../../player/player.js';
import { interactBox } from '../../../proximityBoxes/interactBox.js';
import { boxCollides } from '../../../proximityBoxes/_box.js';
import { aggroBox } from '../../../proximityBoxes/aggroBox.js';
import { entitySheets } from '../../../sheets/entitySheet.js';
import { getMiscSheet } from '../../../sheets/miscSheet.js';
import { changeTextureAnchor, changeTextureAnchor_complex } from '../../../dynamics/textureSwitch/utilties/textureXAnchors.js';
import { uiStyle } from '../../../ui/ui_design.js';
import { playerDealDamage } from '../../../dynamics/attacks/attackMelee.js';

let rats = [];
let ratScale = 1.25;
let ratAnimationSpeed = .5;
let ratHealth = 50;

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

    interactBox(rat, sprite, .75, 0.65, false);
    let aggroFactor = 5;
    aggroBox(rat, sprite, aggroFactor, 0.65, false);

    // Health Bar
    let healthBar = new Container();

    let healthBar_outer = new Graphics();
    healthBar_outer.beginFill(uiStyle.colors.black, 0.5);
    healthBar_outer.drawRect(0, 0, ratHealth, 5);
    healthBar_outer.x = sprite.width / 2 - healthBar_outer.width / 2;
    healthBar.addChild(healthBar_outer);

    let healthBar_inner = new Graphics();
    healthBar_inner.beginFill(uiStyle.colors.red);
    healthBar_inner.drawRect(0, 0, ratHealth, 5);
    healthBar_inner.x = sprite.width / 2 - healthBar_inner.width / 2;
    healthBar.addChild(healthBar_inner);

    rat.addChild(healthBar);

    rats.push({
        container: rat,
        sprite: sprite,
        direction: ratDirection,
        health: ratHealth,
        healthBar: {
            container: healthBar,
            outer: healthBar_outer,
            inner: healthBar_inner,
        },
        state: 'idle',
    });
    return rat;
}

export function aggroEnemy_rat() {
    rats.forEach(rat => {
        if (boxCollides(playerContainer.interactBox, rat.container.aggroBox)) {

            if (rat.state !== 'dead') {

                // These vars can be set in function eventually.
                let target = playerContainer.interactBox;
                let mover = rat.container.interactBox;
                let speed = ratAnimationSpeed * 2.5;
                let yScale = 2.45;

                let dx = target.x - mover.x;
                let dy = target.y - mover.y;
                let distance = Math.sqrt(dx * dx + dy * dy * yScale);
                let sumOfRadii = Math.min(target.rx, target.ry) + Math.min(mover.rx, mover.ry);

                dx /= distance;
                dy /= distance;
                dy *= yScale;

                if (distance > sumOfRadii) {
                    let newDirection = calculateDirection(dx, dy);
                    
                    if (rat.direction !== newDirection || rat.state !== 'walking') {
                        rat.direction = newDirection;
                        rat.state = 'walking';
                        rat.sprite.textures = entitySheets['walking_rat_' + rat.direction];
                        changeTextureAnchor(rat.sprite, rat.direction);
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
                } else {
                    let newDirection = calculateDirection(dx, dy);
                    if (rat.direction !== newDirection || rat.state !== 'idle') {
                        rat.direction = newDirection;
                        rat.state = 'idle';
                        rat.sprite.textures = entitySheets['idle_rat_' + rat.direction];
                        changeTextureAnchor(rat.sprite, rat.direction);
                        rat.sprite.play();
                    }
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
        }
    })
}

export function contactEnemy_rat() {
    rats.forEach(rat => {
        let isColliding = (boxCollides(playerContainer.interactBox, rat.container.interactBox));
        if (isColliding && playerDealDamage && rat.state !== 'dead') {
            rat.health -= 10;
            rat.healthBar.inner.width -= 10;
            death_rat(rat);
        }
    })
}

function death_rat(rat) {
    let textureAnchors_death = {
        'U': {
            x: 0.2,
            y: 0.2,
        },
        'UR': {
            x: 0.2,
            y: 0.2,
        },
        'R': {
            x: 0.2,
            y: 0.2,
        },
        'DR': {
            x: 0.2,
            y: 0.2,
        },
        'D': {
            x: 0.2,
            y: 0.2,
        },
        'DL': {
            x: 0.2,
            y: 0.2,
        },
        'L': {
            x: 0.2,
            y: 0.2,
        },
        'UL': {
            x: 0.2,
            y: 0.2,
        },
    }

    if (rat.health <= 0) {
        rat.state = 'dead';
        rat.sprite.textures = entitySheets['death_rat_' + rat.direction];
        changeTextureAnchor_complex(rat.sprite, rat.direction, textureAnchors_death);
        rat.sprite.loop = false;
        rat.sprite.play();
        rat.healthBar.container.destroy();
        rat.container.children[0].destroy();
    }
}
