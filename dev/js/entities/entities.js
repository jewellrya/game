import { gameScene } from '../_game.js';
import { enemies, enemies_init, enemies_events } from './enemies/enemies.js';
import { containers, containers_init, containers_events } from './containers/containers.js';

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

export function entities_events() {
    // Entity listener events used in the game loop.
    enemies_events();
    containers_events();
}