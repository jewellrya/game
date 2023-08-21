import { AnimatedSprite, Container } from '../../../_game.js';
import { environmentSheets } from '../../../sheets/environmentSheet.js';
import { interactBox } from '../../../proximityBoxes/interactBox.js';
import { getPlayerContainer, getPlayer } from '../../../player/player.js';

let treeAnimationSpeed = 0.01;
let treesArray = [];

export function treeInstance(type, x, y) {
    let tree = new Container();
    tree.x = x;
    tree.y = y;

    let sprite = new AnimatedSprite(environmentSheets[type]);
    sprite.scale.set(3.5);
    sprite.animationSpeed = treeAnimationSpeed;
    sprite.play();

    let shadow = new AnimatedSprite(environmentSheets[type + 'shadow']);
    shadow.scale.set(3.5);
    shadow.animationSpeed = treeAnimationSpeed;
    shadow.play();
    shadow.x = 65;
    shadow.y = 500;

    tree.addChild(shadow);
    tree.addChild(sprite);

    interactBox({ container: tree, sprite, scale: .05, complexY: 0.05, test_graphic: false });

    // Check player's position relative to the tree.
    function checkPlayerBehindTree() {
        let xThreshold, yThreshold, trunkThreshold;

        // Different thresholds since sprites have different paddings of alpha.
        if (type === 'oak1') {
            xThreshold = 100, yThreshold = 50, trunkThreshold = 200;
        }

        // Grab player's location.
        let playerContainer = getPlayerContainer();
        let playerBase = playerContainer.children[0];
        let playerBaseCenter = {
            x: playerContainer.x + playerBase.x + (playerBase.width / 2),
            y: playerContainer.y + playerBase.y + (playerBase.height / 2)
        }

        if (playerBaseCenter.y > tree.y + yThreshold &&
            playerBaseCenter.y < tree.y + tree.height - trunkThreshold &&
            playerBaseCenter.x > tree.x + xThreshold &&
            playerBaseCenter.x < tree.x + tree.width - xThreshold) {

            sprite.alpha = 0.3;
        } else {
            sprite.alpha = 1;
        }
    }

    tree.checkPlayerBehindTree = checkPlayerBehindTree;
    treesArray.push(tree);
    return tree;
}

export function checkPlayerBehindTree() {
    for (let tree of treesArray) {
        tree.checkPlayerBehindTree();
    }
}

