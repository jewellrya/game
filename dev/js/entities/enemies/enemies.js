import { createEnemy_rat } from './rat/rat.js';

export let enemies = [];

function pushEnemy(createFn) {
    let enemy = createFn;
    enemies.push(enemy);
}

export function enemies_init() {
    // Create all enemies here.
    pushEnemy(createEnemy_rat());
}