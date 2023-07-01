import { gameScene } from '../_game.js';
import { enemies, enemies_init } from './enemies/enemies.js';
import { containers, containers_init } from './containers/containers.js';

export let entities = [];

function entitiesPushLoop(array) {
    array.forEach(item => {
        entities.push(item);
    })
}

export function entities_setup() {
    // Initialize each group used in the arrays.
    enemies_init();
    containers_init();

    let arrays = [enemies, containers];
    arrays.forEach(array => {
        entitiesPushLoop(array);
    })

    entities.forEach(entity => {
        gameScene.addChild(entity);
    })
}
