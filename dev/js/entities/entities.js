import { gameScene } from '../_game.js';
import { enemies, enemies_init, enemies_events } from './enemies/enemies.js';
import { containers, containers_init, containers_events } from './containers/containers.js';
import { environment, environment_init, environment_events } from './environment/environment.js';

// Entities are populated into the map, moved around and interacted with the player's movements.
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
    environment_init();

    let arrays = [enemies, containers, environment];
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
    environment_events();
}